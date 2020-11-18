/** Marks html files in this directory as importable into Typescript. */

declare module "*.html" {
    const content: string;
    export default content;
}