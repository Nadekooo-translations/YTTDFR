#include "path.h"
#include <QFormLayout>

#include <QtGlobal>
#include <QDir>
#include <QOperatingSystemVersion>
#include <QJsonDocument>

class UnsupportedOsException : std::exception {};
class NoPathFound : std::exception {};

bool isValidGameDirectory(QDir dir) {
    if (!dir.exists() || !dir.exists("package.json") || !dir.exists("data")) {
        return false;
    }

    QFile systemFile(QDir(dir.absoluteFilePath("data")).absoluteFilePath("System.json"));

    if (!systemFile.open(QIODevice::ReadOnly)) {
        return false;
    }

    QByteArray systemRaw = systemFile.readAll();
    QJsonDocument system = QJsonDocument::fromJson(systemRaw);

    systemFile.close();

    return system["encryptionKey"] == "d41d8cd98f00b204e9800998ecf8427e";
}

QStringList gameSearchPaths() {
    auto ver = QOperatingSystemVersion::current();
    auto type = ver.type();
    QStringList list;

    switch (type) { // yttd doesn't run on macos
    case QOperatingSystemVersion::OSType::Windows:
        list << "C:\\Program Files\\Steam\\Steamapps\\common\\yttd\\www";
        break;
    case QOperatingSystemVersion::OSType::Unknown: // doesn't detect linux
        list << QDir::homePath() + "/.steam/steam/steamapps/common/yttd/www";
        break;
    default:
        throw UnsupportedOsException();
    }

    return list;
}

QDir findValidGamePath() {
    for (QString path : gameSearchPaths()) {
        QDir dir(path);

        if (isValidGameDirectory(dir)) {
            return dir;
        }
    }

    throw NoPathFound();
}

PagePath::PagePath() {
    setTitle(tr("Chemin d'installation de Your Turn to Die"));
    setSubTitle(tr("Choisir l'emplacement d'installation du jeu a patcher"));

    error = new QLabel();
    error->setStyleSheet("color: red;");
    txtPath = new QLineEdit();
    registerField("path*", txtPath);

    QFormLayout *layout = new QFormLayout();
    layout->addRow(tr("Chemin"), txtPath);
    layout->addRow(error);
    setLayout(layout);
}

void PagePath::initializePage() {
    try {
        txtPath->setText(findValidGamePath().absolutePath());
    } catch (NoPathFound) {
        error->setText(tr("Chemin d'installation de Your Turn to Die pas trouvé :("));
    } catch (UnsupportedOsException) {
        error->setText(tr("Votre système n'est pas supporté par ce jeu. L'installation continura tout de même."));
    }
}

bool PagePath::isComplete() const {
    return QWizardPage::isComplete() && isValidGameDirectory(QDir(txtPath->text()));
}
