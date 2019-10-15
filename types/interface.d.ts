import { StaticRouterContext } from 'react-router'

export namespace com {
  export namespace global {
    export interface WindowEx extends Window {
      __STATE__: object;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <F extends Function>(f: F) => <R>(a: R) => R;
    }
    export interface NodeModuleEx extends NodeModule {
      hot: {
        accept: () => void;
      };
    }
  }
  export namespace router {
    export interface StaticRouterContextEx extends StaticRouterContext {
      is404: boolean;
    }
  }
}

