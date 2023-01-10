// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: {
    protocol: 'http',
    host: 'localhost',
    port: '8090',
    endpoints: {
      allVoiture: '/voitureAPI/voiture/JSON',
      allVoitureXML: '/voitureAPI/voiture/XML',
      createVoiture: '/voitureAPI/voiture/JSON',
      deleteVoiture: '/voitureAPI/voiture/JSON/:id',
      editVoiture: 'voitureAPI/voiture/JSON',
      allLoan:'/voitureAPI/loan/JSON',
      addLoan:'/voitureAPI/loan/JSON',
      allpreLoan:'/voitureAPI/loan/pre/JSON',
      addpreLoan:'/voitureAPI/loan/pre/JSON', 
      deletepreLoan:'/voitureAPI/loan/pre/JSON',
      allLog:'/voitureAPI/login/JSON',
      editLog:'/voitureAPI/login/JSON',
      allUser:'/voitureAPI/user/JSON',
      editUser:'/voitureAPI/user/JSON',
      idUser:'/voitureAPI/login/JSON/:id'
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
