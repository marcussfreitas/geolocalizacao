import { Component, OnInit } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import { Circle as CircleStyle, Stroke, Style, Fill } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { easeOut } from 'ol/easing';
import { fromLonLat } from 'ol/proj';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  machinesAccount: number = 0;
  machinesAccountOn: number = 0;
  machinesAccountOff: number = 0;

  machinesOff = [];
  machinesOn = [];
  startCenter = [-40, -10]

  zoomData =
    {
      centerValue: fromLonLat([-43.934098, -19.9290513]),
      onActivity: false
    }

  constructor() { }

  ngOnInit() {
    this.initializeMap(fromLonLat(this.startCenter), this.zoomData);
  }

  initializeMap(center, zoomData) {

    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');


    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    //Início "Gera o mapa"
    let tileLayer = new TileLayer({
      source: new OSM({
        wrapX: false,
      }),
    });

    let source = new VectorSource({
      wrapX: false,
    });

    let vector = new VectorLayer({
      source: source,
    });

    let view = new View({
      center: center,
      zoom: 2.7,

    });

    let map = new Map({
      layers: [tileLayer],
      overlays: [overlay],
      target: 'map',
      view: view,
    });

    map.addLayer(vector);
    //--Fim do "Gera o mapa"

    //Array responsável passar os dados das máquinas
    let machinesOff = this.machinesOff;
    let machinesOn = this.machinesOn;
    //--Fim Array 

    //Início função responsável por gerar os pontos no mapa
    function addFeaturesOff() {
      machinesOff.forEach(element => {
        let geom = new Point(fromLonLat([element.long, element.lat]));
        let feature = new Feature({
          geometry: geom,
          name: element.name,
          ip: element.ip,
          status: element.status
        });
        let estilo = new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#000000',
            }),
          }),
        })
        feature.setStyle(estilo)
        source.addFeature(feature);
      });
    }

    function addFeaturesOn() {
      machinesOn.forEach(element => {
        let geom = new Point(fromLonLat([element.long, element.lat]));
        let feature = new Feature({
          geometry: geom,
          name: element.name,
          ip: element.ip,
          status: element.status
        });
        let estilo = new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#007fff',
            }),
          }),
        })
        feature.setStyle(estilo)
        source.addFeature(feature);
      });
    }
    //Fim função responsável por gerar os pontos no mapa

    //Início "Efeito Ping"
    let duration = 3000;
    function flash(feature) {
      let start = new Date().getTime();
      let listenerKey = tileLayer.on('postrender', animate);

      function animate(event) {
        let vectorContext = getVectorContext(event);
        let frameState = event.frameState;
        let flashGeom = feature.getGeometry().clone();
        let elapsed = frameState.time - start;
        let elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        let radius = easeOut(elapsedRatio) * 25 + 5;
        let opacity = easeOut(1 - elapsedRatio);

        let style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: 'rgba(255, 0, 0, ' + opacity + ')', 
              width: 0.25 + opacity,
            }),
          }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom); 
        if (elapsed > duration) {
          unByKey(listenerKey);
          return;
        }
        // tell OpenLayers to continue postrender animation
        map.render();
      }
    }
    
    //--Fim "Efeito Ping"

    
    setTimeout(addFeaturesOff, 1000); //Gera o ponto off e a animação de flash 1 vez;
    setTimeout(addFeaturesOn, 1000); //Gera o ponto on e a animação de flash a cada 1 seg;
    setInterval(animaView, 125); //Ativa a função animaView a cada 1 seg (Só funcionará se alguma máquina da lista for clicada);

    //Função responsável pela animação ao clicar em uma máquina da lista
    function animaView() {
      if (zoomData.onActivity == true) {
        view.animate({ zoom: 15 }, { center: zoomData.centerValue });
        zoomData.onActivity = false;
      }
    }
    //--Fim função


    //Função responsável por gerar informações ao clicar no ponto
    map.on('singleclick', function (evt: any) {
      let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      const coordinate = evt.coordinate;

      if (feature) {
        content.innerHTML =
          '<span><strong>Informações sobre a máquina:</strong></span><br><br>' +
          '<span>Endereço IP: ' + feature.get('ip') +
          '<br><span>Usuário: ' + feature.get('name') +
          '<br><span>Status de Atividade: ' + feature.get('status');
        overlay.setPosition(coordinate);
      } else {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      }
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    //--Fim função
  }// Fim "initializeMap"

  //Função que passas os dados para construir os pontos
  makePointData(machineData) {
    if (machineData.status === 'inativo') {
      let data = machineData.loc;
      data["ip"] = machineData.ip;
      data["name"] = machineData.name;
      data["status"] = machineData.status;
      this.machinesOff.push(data);
      this.machinesAccountOff++
    }
    else if (machineData.status === 'ativo') {
      let data = machineData.loc;
      data["ip"] = machineData.ip;
      data["name"] = machineData.name;
      data["status"] = machineData.status;
      this.machinesOn.push(data);
      this.machinesAccountOn++
    }
    this.machinesAccount++
  }
  //--Fim função

  //Função que da zoom ao selecionar uma máquina da lista
  zoomMachineSelected(dataMachine) {
    if (dataMachine.status != 0) {
      this.zoomData.onActivity = true;
      this.zoomData.centerValue = fromLonLat([dataMachine.localizacao[0].long, dataMachine.localizacao[0].lat]);
    }
  }
  //--Fim função
}
