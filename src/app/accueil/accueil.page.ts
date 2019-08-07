import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { Platform, Events } from "@ionic/angular";
import {GoogleMaps,GoogleMap,Environment} from "@ionic-native/google-maps/ngx";
import * as $ from "jquery";

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.page.html",
  styleUrls: ["./accueil.page.scss"]
})
export class AccueilPage implements OnInit {

  //#region Variables
  connection: any;
  connexion: any;

  surname: string;
  map: GoogleMap;
  //#endregion

  //#region Constructeur
  constructor(private platform: Platform, public userService: UserService, public events: Events) {
    events.subscribe('menu:click', () => {
      this.refreshSurnameDisplay();
      this.refreshIcone();
    });
  }
  //#endregion

  //#region Ionic Events 
  async ngOnInit() {
    await this.platform.ready();
  }

  // Evennement appelé juste avant de quitter la page
  ionViewWillLeave() {}

  // Evennement appelé quand arrive sur page
  ionViewDidEnter() {
    $("#map_canvas").hide();
    this.showMap = false;

    this.refreshSurnameDisplay();
    this.refreshIcone();
  }
  //#endregion

  //#region Map
  showMap = false;
  loadMap() {
    if (Environment) {
      Environment.setEnv({
        API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBb-oaPjtNbVzZ_1YEoy_3k09z6KVdgOCQ",
        API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBb-oaPjtNbVzZ_1YEoy_3k09z6KVdgOCQ"
      });
    }

    if (this.showMap == false) {
      $("#fond").hide();
      $("#map_canvas").show();

      this.map = GoogleMaps.create("map_canvas");
      //  Environment.setBackgroundColor('red');
      this.showMap = true;
    } else {
      $("#fond").show();
      $("#map_canvas").hide();
      this.showMap = false;
    }
  }
  //#endregion

  //#region Refresh Page HTML
  refreshIcone() {
    if (this.userService.isConnected()) {
      this.cacheIconeUtilisateur();
    } else {
      this.afficheIconeUtilisateur();
    }
  }

  refreshSurnameDisplay () {
    if(localStorage.user) {
      let user = JSON.parse(localStorage.user);
      this.surname = user.surname + " !";
    } else {
      this.surname = "!";
    }
  }
  cacheIconeUtilisateur() {
    // Si connecté alors display none icone
    $("#connect").css("display", "none");
  }

  afficheIconeUtilisateur() {
    // Sinon display flex icone
    $("#connect").css("display", "flex");
  }
  //#endregion
  
  //#region QR
  starQR() {
    const context = this;
    let qr = new QRScanner();

    qr.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was gran

          // start scanning
          let scanSub = qr.scan().subscribe((text: string) => {
            context.resultQR(text);
            $("body").show();
            qr.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          qr.show();
          $("body").hide();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })

      .catch((e: any) => console.log("Error is", e));
  }

  resultQR(resultat) {
    alert(resultat);
  }
  //#endregion

}
