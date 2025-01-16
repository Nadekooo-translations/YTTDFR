#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QOperatingSystemVersion>
#include <QDir>

#include <iostream>
#include <exception>


class UnsupportedOsException : std::exception {};

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
            list << QDir::homePath() + "/.steam/steam/steamapps/yttd";
            break;
        default:
            throw UnsupportedOsException();
    }

    return list;
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

    for (QString str : yttdSearchPaths()) {
        std::cout << str.toStdString() << std::endl;
    }

    return app.exec();
}
