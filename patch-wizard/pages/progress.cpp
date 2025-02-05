#include "progress.h"

#include <QVBoxLayout>
#include <QProgressBar>
#include <QFuture>
#include <QFutureWatcher>
#include <QtConcurrent/QtConcurrent>
#include <QuaZip-Qt6-1.4/quazip/quazip.h>
#include <QuaZip-Qt6-1.4/quazip/JlCompress.h>

extern void install(QPromise<void> &promise, QString dest) {
    promise.setProgressRange(0, 0);
    promise.setProgressValueAndText(50, "Extraction de l'archive...");

    QuaZip patch(":/patch.zip");

    JlCompress::extractDir(patch, dest);
    patch.close();

    promise.setProgressRange(0, 100);
    promise.setProgressValueAndText(100, "Terminé");
    promise.finish();
}

PageProgress::PageProgress() {
    setTitle("Installation...");
    setCommitPage(true);

    bar = new QProgressBar();

    text = new QTextEdit();
    text->setReadOnly(true);

    QVBoxLayout *layout = new QVBoxLayout();
    layout->addWidget(bar);
    layout->addWidget(text);
    setLayout(layout);
}

void PageProgress::initializePage() {
    QString path = field("path").toString();
    QFutureWatcher<void> *watcher = new QFutureWatcher<void>();

    connect(watcher, &QFutureWatcher<void>::finished, this, [=](){
        done = true;
        completeChanged();
    });

    connect(watcher, &QFutureWatcher<void>::progressValueChanged, this, [=](int progress){
        bar->setValue(progress);
    });

    connect(watcher, &QFutureWatcher<void>::progressRangeChanged, this, [=](int min, int max){
        bar->setRange(min, max);
    });

    connect(watcher, &QFutureWatcher<void>::progressTextChanged, this, [=](QString desc){
        text->append(desc + "\n");
    });

    watcher->setFuture(QtConcurrent::run(install, path));
}

bool PageProgress::isComplete() const {
    return done;
}
