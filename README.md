# SAM 2 Webdemo

Flask basierte Webanwendung zur Nutzung des von Meta entwickelte **Segment Anything Model 2**. Diese Demo gibt die Möglichkeit, die Fähigkeiten des Models bezüglich der Erstellung von Bildsegmenten anhand von einfachen nicht-textbasierten Prompts zu nutzen. In der aktuellen Version werden Koordinaten-basierte Prompts anhand von Klicks unterstützt.

## Installation
Um die Webanwendung zu nutzen muss ein **Anaconda Environment** basierend auf der mitgelieferten `environment.yml` erstellt werden:

`conda env create -f environment.yml`

In diesem Environment muss SAM 2 nun entsprechend der Anleitung des [SAM2 Git-Repository](https://github.com/facebookresearch/sam2/tree/main) installiert werden. Die dort genannten Voraussetzungen bezüglich **python**, **torch** und **torchvision** sind durch das Environment abgedeckt.
Wie in der Installationsanweisung beschrieben muss noch ein Checkpoint heruntergeladen werden. Hierfür muss der Checkpoint: [sam2.1_hiera_large.pt](https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_large.pt) heruntergeladen und in das Verzeichnis `./checkpoints` gelegt werden.

Nach erfolgreicher Installation kann die Webanwendung aus dem **flaskr**-Verzeichnis heraus gestartet werden:

`flask run`

oder

`flask run --debug`

um Debug-Ausgaben zu erhalten.

## Verwendung
Die Webanwendung bietet, wie oben genannt, die Möglichkeit Bildsegmente basierend auf Koordinaten-basierten Prompts zu erstellen. Dazu muss über das Input-Feld ein Bild hochgeladen werden. Auf diesem Bild können dann Koordinaten ausgewählt werden, die dem Model zeigen welche Bereiche man gerne segmentiert hätte.
Um Bereiche auszuschließen kann der **Switch** betätigt werden.
Um Koordinaten zu entfernen, muss auf den entsprechenden Koordinaten-Punkt geklickt werden.

Sobald alle gewünschten Koordinaten gesetzt wurden können das Bild und die Prompts durch den Klick auf **Evaluate** an das Model übergeben werden.

Die Bildergebnisse werden auf der **Results**-Seite angezeigt. Darüber hinaus, werden im Projekt noch die **Ergebnis-Bildmasken** in den Ordnern 

<code>./resources/results/images <br>
./resources/results/masks/images <br>
./resources/results/masks/output</code>

abgespeichert. Diese Ordner werden allerdings geleert, sobald man auf die Startseite zurückkehrt.

## Lizenz

Wie auch SAM 2, ist dieses Projekt unter der [Apache 2.0](./LICENSE)-Lizenz lizensiert.
