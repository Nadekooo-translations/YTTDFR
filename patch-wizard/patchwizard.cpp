#include "patchwizard.h"
#include "pages/intro.h"
#include "pages/license.h"
#include "pages/path.h"
#include "pages/progress.h"

PatchWizard::PatchWizard(QWidget *parent)
    : QWizard(parent)
{
    setPage(PAGE_INTRO, new PageIntro);
    setPage(PAGE_LICENSE, new PageLicense);
    setPage(PAGE_PATH, new PagePath);
    setPage(PAGE_PROGRESS, new PageProgress);

    setStartId(PAGE_INTRO);

#ifndef Q_OS_MAC
    setWizardStyle(AeroStyle);
#endif
}

PatchWizard::~PatchWizard() {}
