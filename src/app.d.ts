// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface Locals {
      theme: Theme
    }
    interface PageData {
      theme: Theme
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
