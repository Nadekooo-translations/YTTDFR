import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    width: 640
    height: 480
    visible: true
    title: qsTr("Your Turn to Die en français")

    RowLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true

        Text {
            text: "Bienvenu sur le uhhhhhh yttdfr"
        }
    }

    footer: RowLayout {
        DialogButtonBox {
            Layout.fillWidth: true

            Button {
                id: btnPrevious
                text: "Précédent"
                enabled: false
            }
            Button {
                id: btnNext
                text: "Suivant"
            }
        }
    }
}
