import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  dados;
  @Output() machineSelected = new EventEmitter;
  @Output() machinesDate = new EventEmitter;

  users = [] = [
      {
          name: "user-infoshot",
          ip: "104.123.134",
          status: "ativo",
          localizacao: [
              { long: -43.9319965, 
                lat: -19.9290857},
          ],
      },

      {
          name: "user-casa",
          ip: "934.765.92",
          status: "ativo",
          localizacao: [
              { long: -44.0829377,
                 lat: -19.889735 },
          ],
      },

      {
          name: "user-teste",
          ip: "192.201.36.76",
          status: "ativo",
          localizacao: [
              { long: -43.9353611, 
                lat: -19.9174315 },
          ],
      },

      {
          name: "user-siver",
          ip: "16.75.250.239",
          status: "ativo",
          localizacao: [
              { long: -43.9364232, 
                lat: -19.9187065 },
          ],
      },

      {
          name: "user-quintypue",
          ip: "232.160.94.112",
          status: "ativo",
          localizacao: [
              { long: -44.0184631, 
                lat: -19.9295688 },
          ],
      },

      {
          name: "user-asdasdas",
          ip: "117.5.173.27",
          status: "inativo",
          localizacao: [
              { long: -44.0742342, 
                lat: -19.9234483 },
          ],
      },

      {
          name: "user-ttyertt",
          ip: "117.5.173.27",
          status: "inativo",
          localizacao: [
              { long: -44.07738, 
                lat: -19.9252068 },
          ],
      },

      {
          name: "user-uytuytut",
          ip: "117.5.173.27",
          status: "inativo",
          localizacao: [
              { long: -44.0798222, 
                lat: -19.9256427 },
          ],
      },

      {
          name: "user-teste1",
          ip: "117.5.173.27",
          status: "ativo",
          localizacao: [
              { long: -44.0742342, 
                lat: -19.9234483 },
          ],
      },

      {
          name: "user-teste2",
          ip: "117.5.173.27",
          status: "ativo",
          localizacao: [
              { long: -44.0742342, 
                lat: -19.9234483 },
          ],
      },

      {
          name: "user-teste3",
          ip: "117.5.173.27",
          status: "ativo",
          localizacao: [
              { long: -44.0779426, 
                lat: -19.9253379 },
          ],
      },

      {
          name: "user-teste4",
          ip: "117.5.173.27",
          status: "ativo",
          localizacao: [
              { long: -44.105177, 
                lat: -19.8851129 },
          ],
      }

  ]

  ngOnInit() {
      this.users.forEach(element => {
          this.machinesDate.emit({ loc: element.localizacao[0], status: element.status, ip: element.ip, name: element.name })
      });
  }

  clickedUser(userData) {
      this.machineSelected.emit(userData);
  }
}
