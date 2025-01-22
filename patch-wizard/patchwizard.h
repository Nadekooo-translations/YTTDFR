#ifndef PATCHWIZARD_H
#define PATCHWIZARD_H

#include <QWizard>

class PatchWizard : public QWizard
{
    Q_OBJECT

public:
    enum {
        PAGE_INTRO,
        PAGE_LICENSE,
        PAGE_PATH,
        PAGE_PROGRESS,
        PAGE_DONE
    };

    PatchWizard(QWidget *parent = nullptr);
    ~PatchWizard();
};
#endif // PATCHWIZARD_H
