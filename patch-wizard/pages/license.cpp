#include "license.h"
#include <QTextEdit>
#include <QVBoxLayout>

PageLicense::PageLicense() {
    setTitle(tr("Licence"));
    setSubTitle(tr("Blabla"));
    setButtonText(QWizard::NextButton, tr("J'accepte"));

    QTextEdit *text = new QTextEdit();
    text->setLineWrapMode(QTextEdit::LineWrapMode::WidgetWidth);
    text->setReadOnly(true);
    // TODO move into a ressource
    text->setMarkdown("The French translation found in the `fr.json` file is licensed under the CC BY SA 4.0 International license, see LICENSE-CC-BY-SA\n\
\n\
The English translation found in the `EN.json` file is All Rights Reserved by VGPerson, see <https://www.vgperson.com/games/yourturntodie.htm>\n\
\n\
The original Japanese lines found in the `jp.json` file is All Rights Reserved by Nankidai, see <https://site.nicovideo.jp/atsumaru/contents/kimigashine/>\n\
\n\
The tools and scripts found under the `tools` folder are licensed under the MIT license, see LICENSE-MIT\n\
\n\
The website found under the `www` folder is licensed under the MIT license, see LICENSE-MIT\n\
\n\
Translated images may use the following fonts:\n\
 - NBP Sydnie2 SmallCaps font by total FontGeek under CC BY SA 3.0, see <http://creativecommons.org/licenses/by-sa/3.0/>\n\
 - ゆず ペン字 N (Yuzu Pencil N) either version M or N under \"free font\" licensing, see <https://black-yuzunyan.lolipop.jp/fonts>\n\
 - Pixeloid Sans by GGBotNet under SIL Open Font License Version 1.1, see <https://ggbot.itch.io/pixeloid-font>\n\
 - Noto Sans by The Noto Project Authors under SIL Open Font License Version 1.1, see <https://github.com/notofonts/latin-greek-cyrillic>\n\
 - Coming Soon by Open Window under Apache License Version 2.0, January 2024, see <https://fonts.google.com/specimen/Coming+Soon>\n\
 - Oswald by The Oswald Project Authors under SIL Open Font License, Version 1.1, see <https://fonts.google.com/specimen/Oswald>\n\
 - Caveat by The Caveat Project Authors under SIL Open Font License, Version 1.1, see <https://fonts.google.com/specimen/Caveat>");

    QVBoxLayout *layout = new QVBoxLayout();
    layout->addWidget(text);
    setLayout(layout);
}
