export class ErroDeAplicacao extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.name = 'ErroDeAplicacao';
    this.status = status;
  }
}