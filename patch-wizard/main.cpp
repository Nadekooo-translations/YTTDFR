#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QOperatingSystemVersion>
#include <QDir>

#include <iostream>
#include <exception>
#include <qqmlcontext.h>


class UnsupportedOsException : std::exception {};
class NoPathFound : std::exception {};

QStringList yttdSearchPaths()
{
    auto ver = QOperatingSystemVersion::current();
    auto type = ver.type();

    QStringList list;

    switch (type) { // yttd doesn't run on macos
        case QOperatingSystemVersionBase::OSType::Windows:
            list << "C:\\Program Files\\Steam\\Steamapps\\common\\yttd";
            break;
        case QOperatingSystemVersionBase::OSType::Unknown: // doesn't detect linux
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
        std::cout << "Attempting read: " << path.toStdString() << std::endl;
        QDir dir(path);

        if (dir.exists() && dir.exists("package.json")) {
            return dir;
        }
    }

    throw NoPathFound();
}

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreationFailed,
        &app,
        []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);
    engine.loadFromModule("patch-wizard", "Main");

    try {
        QDir foundDir = findValidGamePath();

        std::cout << foundDir.path().toStdString() << std::endl;
        engine.rootContext()->setContextProperty("gamePath", foundDir.path());
    } catch (NoPathFound) {
        std::cout << "Game not found in default paths" << std::endl;
    } catch (UnsupportedOsException) {
        std::cout << "Running on unsupported OS" << std::endl;
    }

    return app.exec();
}
