#include "patchwizard.h"

#include <QApplication>
#include <QLocale>
#include <QTranslator>
#include <QtResource>

int main(int argc, char *argv[])
{
    Q_INIT_RESOURCE(patch);
    QApplication a(argc, argv);

    QTranslator translator;
    const QStringList uiLanguages = QLocale::system().uiLanguages();
    for (const QString &locale : uiLanguages) {
        const QString baseName = "patch-wizard_" + QLocale(locale).name();
        if (translator.load(":/i18n/" + baseName)) {
            a.installTranslator(&translator);
            break;
        }
    }
    PatchWizard w;
    w.show();
    return a.exec();
}
