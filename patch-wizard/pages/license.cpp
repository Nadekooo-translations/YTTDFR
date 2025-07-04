#include "license.h"
#include <QTextEdit>
#include <QVBoxLayout>
#include <QFile>

PageLicense::PageLicense() {
    setTitle(tr("Licence"));
    setSubTitle(tr("Blabla"));
    setButtonText(QWizard::NextButton, tr("J'accepte"));

    QTextEdit *text = new QTextEdit();
    text->setLineWrapMode(QTextEdit::LineWrapMode::WidgetWidth);
    text->setReadOnly(true);

    QFile licenseFile(":/LICENSE");

    licenseFile.open(QFile::ReadOnly);
    text->setMarkdown(QString(licenseFile.readAll()));
    licenseFile.close();

    QVBoxLayout *layout = new QVBoxLayout();
    layout->addWidget(text);
    setLayout(layout);
}
