#include "path.h"
#include <QFormLayout>
#include <QLabel>
#include <QLineEdit>

#include <QDir>
#include <QOperatingSystemVersion>

class UnsupportedOsException : std::exception {};
class NoPathFound : std::exception {};

QStringList yttdSearchPaths()
{
    auto ver = QOperatingSystemVersion::current();
    auto type = ver.type();
    QStringList list;

    switch (type) { // yttd doesn't run on macos
    case QOperatingSystemVersion::OSType::Windows:
        list << "C:\\Program Files\\Steam\\Steamapps\\common\\yttd";
        break;
    case QOperatingSystemVersion::OSType::Unknown: // doesn't detect linux
        list << QDir::homePath() + "/.steam/steam/steamapps/common/yttd";
        break;
    default:
        throw UnsupportedOsException();
    }

    return list;
}

QDir findValidGamePath()
{
    for (QString path : yttdSearchPaths()) {
        QDir dir(path);

        if (dir.exists() && dir.exists("package.json")) {
            return dir;
        }
    }

    throw NoPathFound();
}

PagePath::PagePath() {
    setTitle(tr("Chemin d'installation de Your Turn to Die"));
    setSubTitle(tr("Choisir l'emplacement d'installation du jeu a patcher"));

    QLabel *error = new QLabel();
    error->setStyleSheet("color: red;");
    QLineEdit *txtPath = new QLineEdit();

    try {
        txtPath->setText(findValidGamePath().absolutePath());
    } catch (NoPathFound) {
        error->setText(tr("Chemin d'installation de Your Turn to Die pas trouvé :("));
    } catch (UnsupportedOsException) {
        error->setText(tr("Votre système n'est pas supporté par ce jeu. L'installation continura tout de même."));
    }

    QFormLayout *layout = new QFormLayout();
    layout->addRow(tr("Chemin"), txtPath);
    layout->addRow(error);
    setLayout(layout);
}
