#ifndef PATH_H
#define PATH_H

#include <QLabel>
#include <QLineEdit>

#include <QWizardPage>

class PagePath : public QWizardPage
{
private:
    QLabel *error;
    QLineEdit *txtPath;

public:
    PagePath();

    void initializePage() override;

    bool isComplete() const override;
};

#endif // PATH_H
