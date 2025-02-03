#ifndef PROGRESS_H
#define PROGRESS_H

#include <QProgressBar>
#include <QTextEdit>
#include <QWizardPage>

class PageProgress: public QWizardPage
{
private:
    bool done = false;
    QProgressBar *bar;
    QTextEdit *text;

public:
    PageProgress();

    bool isComplete() const override;
    void initializePage() override;
};

#endif // PROGRESS_H
