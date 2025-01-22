#include "intro.h"

PageIntro::PageIntro() {
    setTitle(tr("Introduction"));

    QLabel *lblIntro = new QLabel(tr("Cet installateur va vous préparer a installer Your Turn to Die en français"));
    lblIntro->setWordWrap(true);

    QVBoxLayout *layout = new QVBoxLayout();
    layout->addWidget(lblIntro);
    setLayout(layout);
}
