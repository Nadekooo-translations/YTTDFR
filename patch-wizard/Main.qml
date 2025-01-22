import QtQuick
import QtQuick.Controls
import QtQuick.Controls.Material
import QtQuick.Layouts

ApplicationWindow {
    width: 640
    height: 480
    visible: true
    title: qsTr("Your Turn to Die en français")

    Material.theme: Material.Dark
    Material.accent: '#ffa500'

    RowLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true

        RowLayout {
            Image {
                Layout.maximumWidth: 200
                source: "qrc:/sara.png"
                fillMode: Image.PreserveAspectFit
                verticalAlignment: Image.AlignVCenter
            }

            StackLayout {
                id: swipe
                currentIndex: 0

                Item {
                    id: pageWelcome

                    Label {
                        padding: 32
                        text: "Bienvenu sur le uhhhhhh <b>yttdfr</b>"
                    }
                }

                Item {
                    id: pagePath

                    GridLayout {
                        Label {
                            padding: 32
                            text: "Chemin de Your Turn to Die :"
                        }

                        TextField {
                            id: txtPath

                            text: gamePath
                        }
                    }
                }
            }
        }
    }

    footer: RowLayout {
        DialogButtonBox {
            Layout.fillWidth: true

            Button {
                id: btnPrevious
                text: "Précédent"
                enabled: false
                onClicked: swipe.currentIndex--
            }
            Button {
                id: btnNext
                text: "Suivant"

                onClicked: swipe.currentIndex++
            }
        }
    }
}
