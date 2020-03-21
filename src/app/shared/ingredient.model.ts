export class Ingredient {

  /*
   * Without shortcut :
   *
   * public name: string;
   * public amount: number;
   *
   * constructor(name: string, amount: number) {
   *     this.name = name;
   *     this.number = number;
   * }
   */

    // shortcut for the above, we just put public in the params
    constructor(
        public name: string = '',
        public amount: number = null) {}

    clone() {
        return new Ingredient(this.name, this.amount);
    }
}
