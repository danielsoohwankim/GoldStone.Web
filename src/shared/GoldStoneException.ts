class GoldStoneException implements IGoldStoneException {
  public message: string = '';

  constructor(
    message: string,
  ) {
    this.message = message;
  }
}

export interface IGoldStoneException {
  message: string;
}

export const goldStoneException = GoldStoneException;
