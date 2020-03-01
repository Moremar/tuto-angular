import { Ingredient } from '../shared/ingredient.model';

// No Model decorator, it is a simple TS class
export class Recipe {

    constructor(
        public id: number = -1,
        public name: string = '',
        public description: string = '',
        public imagePath: string = '',
        public ingredients: Ingredient[] = []) {}

    clone() {
        return new Recipe(
            this.id,
            this.name,
            this.description,
            this.imagePath,
            this.ingredients.slice());
    }
}
