import { Component, OnDestroy, OnInit } from '@angular/core';
import { empty, Subject, Subscription } from 'rxjs';
import { WorkersService } from './workers.service';
import { AdminsService } from './admins.service';
import { AreasService } from './areas.service';
import * as bcrypt from 'bcryptjs';

import { Worker } from '../worker.model';
import { Admin } from '../admin.model';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { style } from '@angular/animations';
import { Area } from '../area.model';

declare function showCircle(params: number);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {
  searchText = '';
  errorMessage = '';
  workerDetailId = null;
  workerDetailPosition = null;
  private tokenTimer: any;
  workers: Worker[] = [];
  private workersSub: Subscription;
  admins: Admin[] = [];
  private adminsSub: Subscription;
  areas: Area[] = [];
  private areasSub: Subscription;

  private authStatusListener = new Subject<boolean>();


  constructor(public workersService: WorkersService, public adminsService: AdminsService, public areasService: AreasService) { }

  ngOnInit(): void {
    this.workersService.getWorkers();
    this.workersSub = this.workersService.getWorkersListener()
      .subscribe((workers: Worker[] = []) => {
        this.workers = workers;
      });
    this.adminsService.getAdmins();
    this.adminsSub = this.adminsService.getAdminsListener()
      .subscribe((admins: Admin[] = []) => {
        this.admins = admins;
      });
    this.areasService.getAreas();
    this.areasSub = this.areasService.getAreasListener()
      .subscribe((areas: Area[] = []) => {
        this.areas = areas;
      });
    this.setAuthTimer(3600);
  }

  ngOnDestroy() {
    this.workersSub.unsubscribe();
    this.adminsSub.unsubscribe();
    this.areasSub.unsubscribe();
  }

  showDetails(workerId) {
    this.workerDetailId = workerId;
    this.workerDetailPosition = null;
    return true;
  }

  editWorker(id: string, wname: string, wjob: string, wdomain: string, wproject: string, wemail: string, wlphone: string, wmphone: string, wfoto: string, wstand: number) {
    // if (wname == '' || wjob == '' || wemail == '' || wstand == null) {
    //   this.aalert = 'Nie podano wszystkich wymaganych danych lub nie wybrano miejsca';
    //   return false;
    if (wjob == '') {
      this.aalert = 'Nie podano stanowiska';
      return false;
    }else if(wname == ''){
      this.aalert = 'Nie podano imienia i nazwiska';
      return false;
    }else if(wemail == ''){
      this.aalert = 'Nie podano e-maila';
      return false;
    }else if(wstand == null){
      this.aalert = 'Nie wybrano krzesła';
      return false;
    }else if(this.correct == false){
      this.aalert = 'To miejsce jest już zajęte wybierz inne';
      return false;

    } else {
      this.workersService.editWorker(id, wname, wjob, wdomain, wproject, wemail, wlphone, wmphone, wfoto, wstand);
      this.clearWorkerId()
      location.reload();
      return true;
    }
  }

  workersID = -1;
  showId(personId) {
    this.workersID = personId;
    return true;


  }
  clearWorkerId() {
    this.workersID = -1;
    return true;
  }

  delete(workerId) {
    this.workersService.deleteWorker(workerId);
    return true;
  }

  ImageExist(url) {
    var img = new Image();
    if (url == '') {
      return false;
    } else {
      img.src = '../../assets/workers/' + url;
      // img.src = url;
      return img.height != 0;
    }
  }

  acces = ''; //jeśli chcemy usunąć logowanie wpisz yes

  wynik;

  logInn(bname: string, bpass: string) {

    this.wynik = bcrypt.compareSync(bpass, this.admins[0]['password']);

    if (bname == this.admins[0]['name'] && this.wynik === true) {
      this.acces = 'yes';
      localStorage.setItem('access', this.acces);
      this.setAuthTimer(3600);
      return true;
    } else {
      this.errorMessage = 'Nieprawidłowe dane logowania'
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('expiration');
    clearTimeout(this.tokenTimer);
    this.authStatusListener.next(false);
  }

  getAccess() {
    return localStorage.getItem('access');
  }

  blocked;
  block(parBlok){
    this.blocked = parBlok;
  }

  chair = null;
  correct;
  getStand(chairNr, bool) {
    this.chair = chairNr;
    this.correct = bool;
    return true;
  }

  aname = '';
  ajob = '';
  aemail = '';
  alphone = null;
  amphone = null;
  adomain = '';
  aproject = '';
  afoto = '';
  astand = null;
  aalert = '';

  addWorkerForm(wname: string, wjob: string, wdomain: string, wproject: string, wemail: string, wlphone: string, wmphone: string, wfoto: string, wstand: number) {
    // if (wname == '' || wjob == '' || wdomain == '' || wemail == '' || wlphone == '' || wmphone == '' || wstand == null) {
    //   this.aalert = 'Nie podano wszystkich wymaganych danych lub nie wybrano miejsca';

    //   return false;
    if (wjob == '') {
      this.aalert = 'Nie podano stanowiska';
      return false;
    }else if(wname == ''){
      this.aalert = 'Nie podano imienia i nazwiska';
      return false;
    }else if(wemail == ''){
      this.aalert = 'Nie podano e-maila';
      return false;
    }else if(wstand == null){
      this.aalert = 'Nie wybrano krzesła';
      return false;

    }else if(this.correct == false){
      this.aalert = 'To miejsce jest już zajęte wybierz inne';
      return false;
    } else {
      this.aalert = 'Pracownik dodany';
      this.aname = wname;
      this.ajob = wjob;
      this.aemail = wemail;
      this.alphone = wlphone;
      this.amphone = wmphone;
      this.adomain = wdomain;
      this.aproject = wproject;
      this.afoto = wfoto;
      this.astand = wstand;

      this.workersService.addWorker(this.aname, this.ajob, this.adomain, this.aproject, this.aemail, this.alphone, this.amphone, this.afoto, this.astand);

      window.location.reload();
      return true;
    }

  }

  personPlace(workerPosition) {
    this.workerDetailPosition = workerPosition;
    this.workerDetailId = null;
    return true;
  }

  runShowCircle(param) {
    showCircle(param);
  }



}
