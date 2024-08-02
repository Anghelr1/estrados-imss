export interface EstradosResponse {
  aaData: AaDatum[];
  iTotalDisplayRecords: number;
  iTotalRecords: number;
  sEcho: number;
  [property: string]: any;
}

export interface AaDatum {
  areanormativaDTO: AaDatumAreanormativaDTO;
  areaRespNotifDTO: AaDatumAreaRespNotifDTO;
  autorizacionFinalizada: boolean;
  autorizarNotificacion: boolean;
  cveNotificaciones: number;
  cveUsuario: string;
  delegacionDTO: AaDatumDelegacionDTO;
  departamentoDTO: AaDatumDepartamentoDTO;
  desDomicilio: string;
  desNumOficio: null;
  desNumRegCpa: null;
  desRefAcuse: string;
  desRefPublicacion: string;
  desRefRetiro: null;
  estadoError: number;
  fecFinPublicacion: string;
  fecFinPublicacionCadena: null;
  fecInicioPublicacion: string;
  fecInicioPublicacionCadena: null;
  fecPublicacion: string;
  fecPublicacionCadena: string;
  fecRegistro: number;
  fecRetiroPublicacion: string;
  fecRetiroPublicacionCadena: null;
  idDomicilio: null;
  listDocumentosAdjuntosDTOs: ListDocumentosAdjuntosDTO[];
  razonSocial: string;
  registroPatronal: string;
  ssoVwUsuarioDTO: SsoVwUsuarioDTO;
  statusDTO: StatusDTO;
  subdelegacionDTO: AaDatumSubdelegacionDTO;
  sujetoANotificarDTO: AaDatumSujetoANotificarDTO;
  tipodocumentoDTO: AaDatumTipodocumentoDTO;
  [property: string]: any;
}

export interface AaDatumAreaRespNotifDTO {
  areanormativaDTO: null;
  cveAreaRespNotif: null;
  procesoDTO: PurpleProcesoDTO;
  [property: string]: any;
}

export interface PurpleProcesoDTO {
  cveProceso: number;
  desProceso: string;
  [property: string]: any;
}

export interface AaDatumAreanormativaDTO {
  cveAreanorma: null;
  desAreanorma: null;
  [property: string]: any;
}

export interface AaDatumDelegacionDTO {
  anioIniOper: string;
  claveDelegacion: string;
  cveCiz: number;
  cveIdDelegacion: number;
  desDeleg: string;
  desRIMSSDelegacion: string;
  domicilioId: null;
  fecRegistroActualizado: string;
  fecRegistroAlta: string;
  fecRegistroBaja: null;
  tipDelegacion: number;
  [property: string]: any;
}

export interface AaDatumDepartamentoDTO {
  areanormativaDTO: null;
  cveDepto: null;
  desDepartamento: null;
  procesoDTO: null;
  [property: string]: any;
}

export interface ListDocumentosAdjuntosDTO {
  archivo: null;
  cveDoctoAdjunto: number;
  desNombreArchivo: string;
  desNumOficio: string;
  desRefFilesystem: null;
  dtSsoVwUsuarioDTO: null;
  notificacionesDTO: NotificacionesDTO;
  tipoAdjuntoDTO: TipoAdjuntoDTO;
  [property: string]: any;
}

export interface NotificacionesDTO {
  areanormativaDTO: NotificacionesDTOAreanormativaDTO;
  areaRespNotifDTO: NotificacionesDTOAreaRespNotifDTO;
  autorizacionFinalizada: boolean;
  autorizarNotificacion: boolean;
  cveNotificaciones: number;
  cveUsuario: null;
  delegacionDTO: NotificacionesDTODelegacionDTO;
  departamentoDTO: NotificacionesDTODepartamentoDTO;
  desDomicilio: null;
  desNumOficio: null;
  desNumRegCpa: null;
  desRefAcuse: null;
  desRefPublicacion: null;
  desRefRetiro: null;
  estadoError: number;
  fecFinPublicacion: null;
  fecFinPublicacionCadena: null;
  fecInicioPublicacion: null;
  fecInicioPublicacionCadena: null;
  fecPublicacion: null;
  fecPublicacionCadena: null;
  fecRegistro: null;
  fecRetiroPublicacion: null;
  fecRetiroPublicacionCadena: null;
  idDomicilio: null;
  listDocumentosAdjuntosDTOs: null;
  razonSocial: null;
  registroPatronal: null;
  ssoVwUsuarioDTO: null;
  statusDTO: null;
  subdelegacionDTO: NotificacionesDTOSubdelegacionDTO;
  sujetoANotificarDTO: NotificacionesDTOSujetoANotificarDTO;
  tipodocumentoDTO: NotificacionesDTOTipodocumentoDTO;
  [property: string]: any;
}

export interface NotificacionesDTOAreaRespNotifDTO {
  areanormativaDTO: null;
  cveAreaRespNotif: null;
  procesoDTO: FluffyProcesoDTO;
  [property: string]: any;
}

export interface FluffyProcesoDTO {
  cveProceso: null;
  desProceso: null;
  [property: string]: any;
}

export interface NotificacionesDTOAreanormativaDTO {
  cveAreanorma: null;
  desAreanorma: null;
  [property: string]: any;
}

export interface NotificacionesDTODelegacionDTO {
  anioIniOper: null;
  claveDelegacion: null;
  cveCiz: null;
  cveIdDelegacion: null;
  desDeleg: null;
  desRIMSSDelegacion: null;
  domicilioId: null;
  fecRegistroActualizado: null;
  fecRegistroAlta: null;
  fecRegistroBaja: null;
  tipDelegacion: null;
  [property: string]: any;
}

export interface NotificacionesDTODepartamentoDTO {
  areanormativaDTO: null;
  cveDepto: null;
  desDepartamento: null;
  procesoDTO: null;
  [property: string]: any;
}

export interface NotificacionesDTOSubdelegacionDTO {
  anioIniOper: null;
  claveSubdelegacion: null;
  cveIdSubdelegacion: null;
  delegacionDTO: null;
  desRIMSSSubDelegacion: null;
  desSubdelegacion: null;
  domicilioId: null;
  fecRegistroActualizado: null;
  fecRegistroAlta: null;
  fecRegistroBaja: null;
  [property: string]: any;
}

export interface NotificacionesDTOSujetoANotificarDTO {
  cveSujetoANotificar: null;
  desDirigidoA: null;
  sujetoANotificarDTO: null;
  [property: string]: any;
}

export interface NotificacionesDTOTipodocumentoDTO {
  cveTipodocto: null;
  desTipodocumento: null;
  procesoDTO: null;
  [property: string]: any;
}

export interface TipoAdjuntoDTO {
  cveTipoAdjunto: number;
  desTipoAdjunto: string;
  [property: string]: any;
}

export interface SsoVwUsuarioDTO {
  cveDelegacion: string;
  cveIdDelegacion: number;
  cveIdSubdelegacion: number;
  cveSsoAreaNorma: number;
  cveSSODepto: number;
  cveSSOEstatus: number;
  cveSSOPuesto: number;
  cveSubdelegacion: string;
  desAreaNorma: string;
  desClavePresupuestal: null;
  desDelegacion: string;
  desDepartamento: string;
  desEstatus: string;
  desPuesto: string;
  desSubdelegacion: string;
  desUsrCURP: string;
  fechaSistema: null;
  idDelegacion: null;
  idSubdelegacion: null;
  nomMaterno: string;
  nomNombre: string;
  nomPaterno: string;
  refCorreoElectronico: string;
  [property: string]: any;
}

export interface StatusDTO {
  cveStatus: number;
  desEstatus: string;
  [property: string]: any;
}

export interface AaDatumSubdelegacionDTO {
  anioIniOper: string;
  claveSubdelegacion: string;
  cveIdSubdelegacion: number;
  delegacionDTO: SubdelegacionDTODelegacionDTO;
  desRIMSSSubDelegacion: string;
  desSubdelegacion: string;
  domicilioId: null;
  fecRegistroActualizado: string;
  fecRegistroAlta: string;
  fecRegistroBaja: null;
  [property: string]: any;
}

export interface SubdelegacionDTODelegacionDTO {
  anioIniOper: string;
  claveDelegacion: string;
  cveCiz: number;
  cveIdDelegacion: number;
  desDeleg: string;
  desRIMSSDelegacion: string;
  domicilioId: null;
  fecRegistroActualizado: string;
  fecRegistroAlta: string;
  fecRegistroBaja: null;
  tipDelegacion: number;
  [property: string]: any;
}

export interface AaDatumSujetoANotificarDTO {
  cveSujetoANotificar: number;
  desDirigidoA: string;
  sujetoANotificarDTO: SujetoANotificarDTOSujetoANotificarDTO;
  [property: string]: any;
}

export interface SujetoANotificarDTOSujetoANotificarDTO {
  cveSujetoANotificar: number;
  desDirigidoA: string;
  sujetoANotificarDTO: null;
  [property: string]: any;
}

export interface AaDatumTipodocumentoDTO {
  cveTipodocto: number;
  desTipodocumento: string;
  procesoDTO: TipodocumentoDTOProcesoDTO;
  [property: string]: any;
}

export interface TipodocumentoDTOProcesoDTO {
  cveProceso: number;
  desProceso: string;
  [property: string]: any;
}
