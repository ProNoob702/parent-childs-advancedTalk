export interface IChildHeights {
  [key: string]: number;
}
export class ChildsHeightsService {
  private static childsHeights: IChildHeights = {};

  public static setChildHeight(childKey: string, newHeight: number) {
    this.childsHeights[childKey] = newHeight;
  }

  public static getChildsHeights() {
    return this.childsHeights;
  }
}
