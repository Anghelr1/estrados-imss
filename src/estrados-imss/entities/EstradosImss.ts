import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('estrados_imss')
export class EstradosImss {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('bigint')
  cveNotificaciones: number;

  @Column({
    nullable: true,
    type: 'text',
  })
  registroPatronal: string;

  @Column('text')
  razonSocial: string;

  @Column('text')
  desDomicilio: string;

  @Column('date', { name: 'fec_publicacion' })
  fecPublicacion: Date;

  @Column('date', { name: 'fec_inicio_publicacion' })
  fecInicioPublicacion: Date;

  @Column('date', { name: 'fec_fin_publicacion' })
  fecFinPublicacion: Date;

  @Column('date', { name: 'fec_retiro_publicacion' })
  fecRetiroPublicacion: Date;

  @Column('bigint', { name: 'fec_registro' })
  fecRegistro: number;

  @Column('text', { name: 'fec_publicacion_cadena' })
  fecPublicacionCadena: string;

  @Column('bigint', { name: 'cve_docto_adjunto_acuerdo' })
  cveDoctoAdjuntoAcuerdo: number;

  @Column('text', { name: 'des_num_oficio_acuerdo' })
  desNumOficioAcuerdo: string;

  @Column('text', { name: 'des_nombre_archivo_acuerdo' })
  desNombreArchivoAcuerdo: string;

  @Column('text', { name: 'des_tipo_adjunto_acuerdo' })
  desTipoAdjuntoAcuerdo: string;

  @Column('bigint', { name: 'cve_docto_adjunto_documento' })
  cveDoctoAdjuntoDocumento: number;

  @Column('text', { name: 'des_num_oficio_documento' })
  desNumOficioDocumento: string;

  @Column('text', { name: 'des_nombre_archivo_documento' })
  desNombreArchivoDocumento: string;

  @Column('text', { name: 'des_tipo_adjunto_documento' })
  desTipoAdjuntoDocumento: string;

  @Column('text', { name: 'des_tipodocumento' })
  desTipodocumento: string;

  @Column('text', { name: 'des_proceso' })
  desProceso: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column('text', { name: 'ruta_archivo_acuerdo', nullable: true })
  rutaArchivoAcuerdo: string;

  @Column('text', { name: 'ruta_archivo_documento', nullable: true })
  rutaArchivoDocumento: string;
}
