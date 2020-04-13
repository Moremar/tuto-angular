
                  ANGULAR TUTORIAL
                  ----------------

SETUP
-----

Download required tools :
- Install Node.js (including NPM)
- Install Angular/CLI :     npm install @angular/cli -g
- Install typescript  :     npm install typescript -g
  This install globally the tsc command (transcript compiler) to transpile TS into JS.
  Transpile TS to JS :      tsc myfile.ts
  Execute JS code :         node myfile.js

Download Visual Studio Code IDE :
- Install Visual Studio Code from their website (nice support for Angular)
- From the Welcome page, press Cmd-Shift-P, then "Install 'code' command in PATH"
  Now we can use the "code" command from the Shell

Debug tools :
- Chrome console
- Chrome developer tool to put breakpoints in the TS code (thanks to sourceMaps between JS and TS)
- Augury (Chrome extension) that shows the state of each Angular component of the app


ANGULAR CLI
-----------

Angular CLI is the command line interface to assist Angular development.
It is the best tool for building / testing / deploying Angular apps.
It can create boilerplate code for Angular project (component, module, service, guard).

ng v                        Version infos of Angular / Node / OS
ng                          List all available commands
ng <cmd> --help             Help for a specific ng command
ng new projectName          Create a boilerplate Angular project
ng serve -o                 Build the app and start a web server
                            -o to open a browser
                            --port to specify a port (default 4200)
ng g c path/componentName   Generate a new component (HTML / TS / CSS / Test)
                            Can be ran from the project root (no need to specify src/app/)
                            use --flat to not create a dedicated folder for that component
                            ("angular generate component")
ng g g path/guardName       Generate a new guard (TS)
ng g m path/moduleName      Generate a new module (TS)
ng g d path/directiveName   Generate a new directive (TS)
ng test                     Run the tests
ng e2e                      Run end-to-end tests
ng build                    Build app for deployment
                            Bundles are created under /dist
ng build --prod             Build for prod
ng update                   Update the project to latest angular version


WHAT IS ANGULAR ?
-----------------

- JS framework for client-side application (frontend).
- create a Single Page Application
- uses HTML / CSS / Typescript
- Expressive HTML (if, loops, ...)
- powerful data binding
- modular by design
- builtin backend integration
- complete rewrite of its predecessor AngularJS

An Angular App is composed of several elements :
 - components  : representing one element of the app (TS + HTML + CSS)
 - modules     : grouping building blocks (components, services, directives ...) by functionality
                 Small apps may have only one module.
 - services    : utility class used across the app by multiple components or services (TS)
 - models      : representation of a concept used across the app (TS)
 - guards      : code executed before loading a route to validate or resolve data (TS)
 - directives  : custom properties we can add to some components (TS)

A component is made of :
- a template : HTML file representing the component view
               It can contain references to properties / methods from the TS class
               Those reference are between {{ ... }}, this is called 'data-binding'
- a TS class : TS file defining the behavior of the component (properties + methods)
- metadata   : additional info about the component for Angular, defined with a decorator
               The class decorator is @Component(), and contains :
                ~ the selector (name of the component tag)
                ~ the template or template files
                ~ the style file
- a CSS stylesheet : styles that will be applied only to elements in this component
                     Angular simulates a shadow DOM by applying a specific property to all
                     tags in the same component (something like "ngcontent-ejo-2") and add
                     this property in our CSS selectors to target only tags in our component.

Most Angular apps use TypeScript, subset of JS compiling in JS offering classes and
strong typing.

Modules
-------

Every angular app has at least 1 module, by default called app-module.
We can create other Angular modules to group components related to a given feature.
This makes the code much more readable, maintainable and allows performance improvements (lazy loading).
Every module contains a bunch of components / directives / pipes ...
A component / directive / pipe is part of one and only one module.
Services are usually included app-wide with the "providedIn" prop set to "root", so they
do not appear in the module definition.
A frequent module is app-routing.module.ts in charge of the routing.

Some modules are provided built-in in Angular, for example the FormsModule containing the ngModel directive.
All modules we use in our app (custom and builtin) must be listed in the "imports" of AppModule (or of
the feature module usniig them).
When we import a module, we basically import everything this module exports.
Everything else the module declares but does not export is not accessible.
That is why the AppRoutingModule updates the RouterModule, and then exports it, so AppModule imports it and has routing.

To create a feature module, we just need a TS class with NgModule() decorator and the folowing props :
- "declarations" : all components that belong to this module (each component iis declared in a single module)
- "imports" :      modules containing some components used in the module (AppRoutingModule, FormsModule,...)
                   must always contain CommonModule (or a module exporting it, like a custom SharedModule).
- "exports" :      all components that we want to make available to other modules importing this module
                   the components only used inside this module do not need to be exported
We can also move the routes related to this module into a dedicated xxx-routing.module.ts module.
This must use the forChild() method of the router module, and export the RouterModule :
    RouterModule.forChild(routes)

We can create one (or several) shared module.
It is very similar to feature modules, but it exports all its components so other modules that import it
can include these components in their templates.

We see sometimes a Core module in some Angular projects.
It is meant to include all the services that will be available across the app.
An alternative to this in recent Angular is to use prop "providedIn" set to 'root' in the services.
Then services are included app-wide and do not need to be included in any module definition.

We can use "lazy loading" to associate some roots with a module, and load the components in the module only
when one of its routes were called.
To set up lazy loading :
  - add in the app-routing.module.ts file a route without a "component", but with a "loadChildren" property with
    a lambda returning the name of the module to load lazily :
        path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule),
  - in the routing of the lazily loaded module, the "root" route should now be '' (since the root route is now
    included in app-routing and loads the child module)
  - remove the lazily loaded module from the TS and Angular imports in AppModule
We can now see in the Network inspector of the browser debugger that the main.js is smaller, but when we actually
navigate to a route in the lazily loaded module, the browser loads another js bundle for this module.

By default lazily loaded modules are loaded when called.
To improve the perf, we can set the loading strategy to preload all modules in app-routing.module.ts :
  imports: [ RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}) ],


Angular comes with an integrated web server (started with "ng serve -o").
It uses webpack that bundles all our code into JS bundles every time we save.
This is called HMR (Hot Module Replacement), the code is automatically re-bundled
and the page is updated everytime we change and save the code.

An Angular app is a single page application. It serves the HTML file "index.html".
This file will contain our "app-root" component, that will contain all our app.

When we run "ng serve", the Angular CLI groups our custom code (all our components) into JS bundles
and add it at the end of the served index.tml.
The first code to be executed is main.ts, that bootstraps the AppModule.
The AppModule contains a "bootstrap" property equal to [ AppComponent ], so Angular knows that the app
must load this component at startup, and it can then replace it in the index.html.

The components we will create will always be added to the HTML of AppComponent or its sub-components.

The data that we use across the app can be represented by models.
The files should be named XXX.model.ts, and will represent the structure of the data.
For ex in our app managing recipes, we will have a recipe.model.ts to represent what info a recipe contains.


DEPLOY ANGULAR APP
------------------

The Angular project is build for production with :  ng build --prod
This will generate under the dist/ folder a few files that we can deploy to run our app.
These files are a shrinked version of our app code.

After the artifacts (generated files) are built, we get only HTML / CSS / JS code.
This can thus be deployed to a static website host that deliver only HTML/CSS/JS.
Popular options are :
  - AWS S3 (need AWS account)
  - Firebase Hosting (completely independant from the Firebae DB we use in the project)
If we have a custom backend, we obviously need to ensure they can communicate (REST API...).

Deploy with Firebase Hosting
----------------------------
Firebase hosting offers hosting service for static (HTML/JS/CSS) and dynamic (Express) websites.
We can link it to use a custom domain name.
website : https://firebase.google.com/docs/hosting
 - install Firebase CLI to get the "firebase" command :
   $>  npm install -g firebase-tools
 - login to our Google account :
   $>  firebase login
 - initialize our project in Firebase :
   $>  cd <project_path>
   $>  firebase init
       -> select "Hosting" with Space, then Enter
       -> select the Firebase project created earlier (or create a new one if didnt use Firebase earlier)
       -> for the folder, do not use "public", replace by the folder of our code (dist/recipe-app for me)
       -> Single-page app : "y"
       -> overwrite index.html: "N"
 - deploy the built files to Firebase :
   $>  firebase deploy
   This outputs an URL where our app is available on Firebase servers.
   The deployed files can now be seen in the Hosting tab of the Firebase console of this project.


Note 1 : "Ahead of Time" compilation
         ---------------------------
When running "ng serve -o", we are running a web server and shipping the Angular compiler in the app.
Everytime we query some component, the compiler will be called in the browser to convert Angular templates into JS code.
This is called "Just In Time" compilation, which is great for debugging.
In prod we want to pre-compile to JS and not ship the Angular compiler, this is "Ahead of Time" compilation.
It is stricter than the "Just In Time" compiler used in debug, so new compilation errors can occur :
 - If some TS code is not understood in the template, we can move it to a function in the TS

Note 2 : Environment variables
         ---------------------
Angular offers in ./src/environments/ a prod and QA file for environment variables.
The "env" object can store some key/value pairs.
Angular will automatically pick the prod or QA file depending on how we build.
This way we can use different values for prod and QA (for ex to store an API key).
To use it in the code, just import "environment" from src/environments/environment.



DATA BINDING
------------

- String Interpolation  (.ts => .html)
  Resolve a TS expression in the text of a component :
    <div> {{ title }} </div>

- Property binding (.ts => .html)
  Link a property of an HTML tag to a TS expression :
    <div [style.color]="colorField"> XXX </div>

- Event binding (.html => .ts)
  Call TS function when an even is triggered by an HTML tag.
  If specified, the $event param contains info on the event (click coords, input text, ...).
  <button (click)="onClick()" > XXX </button>
  <input (input)="onInputChange($event)" />

- Two-way binding (.ts <=> .html)
  Used for inputs, to update a prop if the input changes, and to update the input if the prop changes.
  Requires to import FormsModule in app-module.ts for the "ngModel" directive.
  <input type="text" [(ngModel)]="myStrVar">



COMMUNICATION BETWEEN COMPONENTS
--------------------------------

Parent -> Child : @Input()
--------------------------

For a parent component to give an object to one of its children, we use custom property binding.
We want to pass the object with a custom property like this :
    <app-child-elem [server]="serverObjectInParent">

To do so, we need to create the "server" property in the TS of the child component with the @Input() decorator
to make it settable from outside
We can give the property a different name outside of the child component by giving a name in the @Input()

Child -> Parent : @Output()
---------------------------

A child component can emit an event (with some data in it) that can be intercepted by a parent component.
To do so, we need to :

   - in the child component TS, create an Event Emmitter property with @Output() decorator.
     Just like @Input(), we can give a name in @Output() to name the event differently from the property name.
       @Output() serverCreated = new EventEmmitter<{name: string, content: string}>();

   - in the child component TS, from a method (called on click for ex), emit an event :
       this.serverCreated.emit({name: 'serverTest', content: 'I am a test'});

   - in the parent component HTML, catch the custom event :
       <app-child-elem (serverCreated)="onServerCreated($event)">

   - in the parent component TS, define the method to call once the event is intercepted :
       onServerCreated(serverData: {name: string, content: string}) { ... }



SERVICES
--------

Services in Angular are TS classes that can be used from any component or services.
Typical usecases are logging, data management or HTTP requests to the backend.

There is no @Service() decorator, but we can use the @Injectable() decorator.
It is technically required only if the service injects other services in its constructor.

Angular can inject an instance of a service in a component from its constructor.
The service needs to be specified in the "providers" list property of the @Component() decorator
or one of its ancestors (the module for ex).

When adding a service in the "providers" property of a @Component() directive, we inform Angular
to provide the SAME instance of the service to all components under that component.
So if we provide the service in app.module.ts, all components of this module will use the same
instance of the service.
If a component provides a service, it will create a new instance of the service (even if it was
provided by a parent component or in the module).
This is very important for services sharing data, they need to be injected in the module so that
all components use the same instance.

If the service is provided at module level, it can also be injected in services.
To inject a service in another service, the service that needs injection needs to use decorator @Injectable();
It is not required for other services, but it is a good practice to put it on all services.

In the @Injectable() decorator we can add :  { providedIn: 'root' }
This automatically provides the service at module level (no need to add it in the module ourselves).

Services can be used for inter-component communication.
This is much simpler than passing around information from component to component with @Input()/@Output() chains.

 - in the service, create a property of type EventSubmitter :
     statusUpdated = new EnventSubmitter<string>();

 - in component A, submit an event with this service in a method :
     this.myService.statusUpdated.emit('amend');

 - in component B, subscribe to this event emitter in the ngOnInit() :
     this.mySub = this.myService.statusUpdated.subscribe(
         (status: string) => { alert('New Status : ' + status); }
     );

 - in component B, unsubscribe in the onDestroy() method :
     this.mySub.unsubscribe();



LOCAL REFERENCE
---------------

We can create a local reference on any tag of a template with a # :
  <input type="text" class="form-control" #myInput />

Then from anywhere inside the template we can reference it (not from the TS !!).
It can be used with string interpolation :
  {{ myInput.value }}

Or as a parameter of a method call :
  <button type="button" (click)="onClick(myInput)"> Click </button>

The method onClick can now access the input element, so can access for ex its text value with :
  onClick(input: string) { console.log(input.value); }

We can use a local reference instead of a property binding to make the code smaller when the
value we bind to (an input usually) is used only from the template.

We can also reference a local reference from the TS if we create a property with the decorator @ViewChild().
We can give @ViewChild() the element type of the local reference name :
  @ViewChild('myInput') input : ElementRef;

It now references the <input>, and can be accessed with its 'nativeElement' property :
  console.log(input.nativeElement.value);

Avoid assigning it directly to a value though, prefer 2-ways binding for this scenario.

Note : in Angular 8, wee need to add {static: true} in the @ViewChild() decorator if we use it in ngOnInit()



ng-content
----------

By default, any content included between the opening and closing tags of our custom components is lost.
If we want to allow a parent to pass some HTML content to a child component, the child component must
specify in its HTML where the content must be included, by adding the <ng-content> tag.

If an element in the content has a local reference, we can access it from the child component TS code
by creating a property with the @ContentChild('myInput') decorator.

Its content can of course not be accessed before the content is initialized (in ngOnInit() for ex).



COMPONENT LIFECYCLE HOOKS
-------------------------

Angular provides some methods we can define to execute some code at different stages of our component's life.

ngOnInit              : when the component is initialized (after constructor call)
ngOnChanges           : after any input property change (and also when just created)
ngDoCheck             : at every change detection run (very often called)
ngAfterContentInit    : after content (ng-content) has been projected
ngAfterContentChecked : every time the projected content has been checked
ngAfterViewInit       : after the component (and its children) is rendered
ngAfterViewChecked    : every time the view (and children view) has been checked
ngOnDestroy           : just before the component is destroyed

For each of these hooks, there is an angular interface we should implement to explicit that we use this hook.
Only ngOnChanges() hook takes a parameter with the value of all changed input properties :
  ngOnChanges(changes: SimpleChanges) { console.log(changes); }



ROUTING
-------

An Angular app is a single-page component but Angular offers routing possibilities to make it look like
the user navigates across different pages, by changing the URL and displaying some specific components
depending on the selected route.

We can add routes and their associated components in app.module.ts :
  routes : Routes = [
    { path: '', component: HomeComponent },           // localhost:4200
    { path: 'users', component: UsersComponent },     // localhost:4200/users
    { path: 'cards', component: CardsComponent }      // localhost:4200/cards
  ];

Then we need to import the router module and give it the routes :
  import: [
     ...
     RouterModule.forRoot(routes)
  ]

Then in the HTML component where we want routing (most likely in app.component.html), we need to add an
Angular directive to display the ccomponent of the selected route :
  <router-outlet><router-outlet>


Router links
------------

We need some links to navigate from one page to the other inside our app.
Simply using href="/users" is not good, it works but it reloads the whole app so all states are lost.
Instead we use the "routerLink" directive, that can take either a string or an array of segments :
  <a routerLink="/users"> XXX </a>
  <a [routerLink]="['/users', '123']"> XXX </a>    // route to localhost:42000/users/123

To style our links when they are active, Angular offers the "routerLinkActive" directive that can receive a class
to attach to the element when it is active. This directive can be attached both to the <a> or to the <li>
containing it.
With Bootstrap CSS, we need to attach the "active" class to the containing <li>.
By default the routerLinkActive class will be attached if the path is included in the current path.
This is an issue for the root path "/" (usually used for Home) that is included in all routes.
We can pass a parameter to the routerLinkActive directive to force an exact match :
  <ul class="nav nav-tab">
    <li routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"> <a routerLink="/users"> Home </li>
    <li routerLinkActive="active"> <a routerLink="/users"> Users </li>
    <li routerLinkActive="active"> <a routerLink="/cards"> Cards </li>
  </ul>

To navigate to a route programatically, we can inject the Router element in the constructor and call :
  this.router.navigate(['/users', '123']);

If we want to programatically navigate to a relative route, we need to specify it to Angular.
Inject the current active route of type ActivatedRoute in the constructor, and pass it to the navigate() method :
  this.router.navigate(['users', '123'], {relativeTo: this.activatedRoute});

Router parameters
-----------------

We can define dynamic segments in a route (in app.module.ts) by prefixing the segment with ":" :
    { path: 'users/:id', component: UserComponent },  // localhost:4200/users/123

Query params (like ?readOnly=Y) can also be added to our routes.
From the HTML code, we can use the "queryParams" property of the "routerLink" directive :
  <a routerLink="/users/123" [queryParams]="{readOnly: 'Y'}"> XXX </a>

Fragments (like "#conclusion") can also be added with the "fragment" property (just a string so does not need [..]):
  <a routerLink="/users/123" fragment="conclusion"> XXX </a>

These parameters/query params/fragment can be retrieved from TS in the ngOnInit() method of the UserComponent.
We need to inject the active route (of type ActivatedRoute) and get the param from its snapshot :
  this.activatedRoute.snapshot.params['id'];
  this.activatedRoute.snapshot.queryParams['readOnly'];
  this.activatedRoute.snapshot.fragment;

Both query params and fagments can be added programatically through the options param of the navigate() method :
  this.router.navigate(['/users', '123'], { queryParams: { readOnly: 'Y' }, fragment: 'conclusion'});

If we want to react when the params/query params/fragment change, we need to subscribe to its observable.
It has the same name but without the "snapshot" :
  this.activatedRoute.params.subscribe(
    (params: Params) => { this.userId = params['id']; }
  );

Theoretically we should unsubscribe in the ngOnDestroy() hook, but we do not have to do it because Angular
already cleans the subscription for us when the component is destroyed (only for Angular observables).

Note that when we navigate to a different route of our app, we lose the query params by default.
To preserve our current query params or merge with some new ones, we set the queryParamsHandling option :
  this.router.navigate('edit', {relativeTo: this.activatedRoute, queryParamsHandling: 'preserve'});


Nested Routes
-------------

We can define sub-routes in a route if we want a hierarchy of pages in our app.
If we write this in app.module.ts :
    { path: 'users', component: UsersComponent },     // localhost:4200/users
    { path: 'users/:id', component: UserComponent },  // localhost:4200/users/123
Then "users/:id" route is not a child of "users", so when it matches the route, "UserComponent"
will be loaded in the top level <router-outlet> it finds, and "UsersComponent" will not be loaded.

If we want UserComponent to be laoded somewhere inside UsersComponent, then we can write :
    { path: 'users', component: UsersComponent, children: [
        { path: ':id', component: UserComponent }
    ] },
In this case we need to have another <router-outlet> inside UsersComponent to specify where to include the child.

Wildcards and Redirection
-------------------------

We can redirect a route to another one with :
    { path: '/home', redirectTo: '/' }

Default route (need to be the last one, since routes are evaluated in order) :
    { path: '**', component: NotFoundComponent }

External Routing module
-----------------------

It is a good practice to use a separate module for the routing of our app.
We can create an app-routing.module.ts file (created by default by CLI is we specify routing) :
 - create a AppRoutingModule with NgModule() decorator
 - add the routes definition to this file outside of the AppRoutingModule definition
 - in the "imports" of AppRoutingModule add the RouterModule.forRoot(routes)
 - in the "exports" of AppRoutingModule add the RouterModule
 - in the import of AppModule add this AppRoutingModule

Passing data to our routed component
------------------------------------

When defining the route, we can provide the "data" property (map of key/value pairs).
Just like queryParams, it can then be accessed in the component via the injected ActivatedRoute instance :
  this.activatedRoute.snapshot.data['myData']



GUARDS
------

Activation guard
----------------

We can create a guard to prevent a route to be loaded under some conditions.
A guard is a service that implements the CanActivate interface, that returns either a boolean,
a Promise<boolean> (that will return later) or an Observable<boolean> (that must be subscribed to).
Since it is a service, the guard needs to be added to the "providers" property in app.module.ts, or should
have in its @Injectable() decorator the 'providedIn' property set to 'root'.

For ex if we have an authentication service with an isLoggedIn() method returning a Promise<boolean>, we can define
our authentication guard like :

export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :
      boolean | Observable<boolean> | Promise<boolean> {
    this.authService.isLoggedIn().then(
      (loggedIn : boolean) => {
        if (loggedIn) {
          return true;
        } else {
         this.router.navigate('/login');
         return false;			// optional since we already move away from the requested route
        }
      }
    );
  }
}

The guard needs to be added to the "canActivate" property of the route we want to protect.
It will automatically apply on all its children.
We can have several guards for each route.
  { path: '/users', component: UsersComponent, canActivate: [AuthenticationGuard] }

If we want to allow access to the route but add a guard only to its children routes, we can use
the property and interface "canActivateChild" instead of "canActivate".


Deactivation guard
------------------

It can also be useful to create a guard to check if we can safely leave a route, for example to check for
unsaved changes and display a confirmation popup.
This can be used by implementing the CanDeactivate interface.
The pattern is to create our own interface "SafeToLeave" that has a single method safeToLeave() that our component
will need to implement.
Then the guard will call this safeToLeave method from the component when it tries to leave the route :

  export interface SafeToLeave {
    safeToLeave : () => boolean | Promise<boolean> | Observable<boolean>;
  }

  export class CanDeactivateGuard implements CanDeactivate<SafeToLeave> {
    canDeactivate( component : SafeToLeave,
                   currentRoute: ActivatedRouteSnapshot,
                   currentState: RouterStateSnapshot,
                   nextState?: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
     return component.safeToLeave();
   }
  }

Resolver guard
--------------

We can use a resolver guard to fetch data from a backend before we actually display the routed component.
We must create a ResolveGuard service implementing the Resolve interface.

  export class ServerResolveGuard implements Resolve<Server> {
    constructor(private serversService: ServersService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Server | Promise<Server> | Observable<Server> {
      return serversService.getServer(+route.params['id']);
    }
  }

Then in the app.module.ts (or AppRoutingModule if we put routing in its own module) we need to add to the route the
property "resolver" taking a map of (resolver name, resolver guard) :
 { path: '/servers/:id', component: ServerComponent, resolve: {server: ServerResolveGuard} }

From the ServerComponent, the resolved server can be accessed in the "data" field of the active route :
  this.activatedRoute.snapshot.data['server']      // if we just need it at init
  this.activatedRoute.data.subscribe(
    (data: Data) => { this.server = data['server']; }
  );



DIRECTIVES
----------

Built-in Directives
-------------------

Directives are custom properties we can define and add to our tags.
Angular has some built-in directives, structural directives modifying the DOM must start with *.
Structural directives are just a trick to write more readable code, but they are not real directives.
They get transformed by Angular into valid HTML code without the star.

- Conditional tag :  *ngIf
  Take a boolean, display the tag if the TS results to true.
  <p *ngIf="shouldBeThere"> XXX </p>
  Weird syntax if we want a if/else :
    <p *ngIf="shouldDislay; else #other"> XXX </p>
    <ng-template #other> <p> YYY </p> </ng-template>

 Behind the scene, Angular will transform it into :
  <ng-template [ngIf]="shouldBeThere"> <p> XXX </p> </ng-template>

- Selection of a tag among several : ngSwitch / *ngSwitchCase / *ngSwitchDefault
  Only the options of the switch take a * :
    <div [ngSwitch]="value">
      <p *ngSwitchCase="1"> I am 1 ! </p>
      <p *ngSwitchCase="2"> I am 2 ! </p>
      <p *ngSwitchCase="3"> I am 3 ! </p>
      <p *ngSwitchDefault> I am not 1/2/3 ! </p>
    </div>

- Repeat a block multiple times :  *ngFor
  Repeat a block for all elements of an array.
  <p *ngFor="let server of serverNames"> {{server}} </p>
  We can get the current index with :
  <p *ngFor="let server of serverNames; let i = index"> Loop {{i}} : {{server}} </p>

- Dynamic style: ngStyle
  Take a dict of property/value, no star because no DOM change.
   <p [ngStyle]="{backgroundColor: getColor()}"> XXX </p>

- Dynamic classes: ngClass
  Take a dict of string/boolean, to decide if each class is assiciated to the tag.
   <p [ngClass]="{online: isOnline()}"> XXX </p>


Custom Attribute Directives
---------------------------

We can also create our own directives, as a TS class with the @Directive() decorator.
The directive needs to be added in the "declarations" of the module for Angular to know it.
The reference of the element that uses this directive can be injected from the constructor between [ ... ] :

@Directive({ selector: '[appBasicHighlight]' })
export class BasicHighlightDirective implements OnInit {
  // inject the ElementRef and shortcut to make it a property
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.backgroundColor = 'blue';
  }
}

This directive can then be used in our HTML like this :
   <p appBasicHighlight> I am blue ! </p>

It is not recommended to directly amend the style of an HTML element from the TS code though.
A better approach is to use a renderer, also injectable by Angular in the constructor :

   constructor(private elementRef: ElementRef, private renderer : Renderer2) { }
   ngOnInit() {
     this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'blue');
   }

Making Custom attribute directives dynamic
-------------------------------------------

The directive can react to an event happening in the host component by defining a method with
@HostListener() decorator.
For ex for the directive to set a blue background on hover, we can define :
  @HostListener('mouseenter') onMouseOnter(eventData: Event) {
     this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'blue');
  }

If we just need to bind to a property of the host component, a simpler way is to use @HostBinding()
instead of using the renderer.
It binds a property of the host element to a field of our directive :

  @HostBinding('style.backgroundColor') bgColor: string;
  @HostListener('mouseenter') onMouseOnter(eventData: Event) {
     bgColor = 'blue';
  }

The directive can receive some parameters with @Input(), just like a component:
  @Input() highlightColor : string = 'blue';
To pass the parameter to the directive, we bind it just like we do for a component.
Angular figures out if it is for the component or for a directive :
   <p appBasicHighlight [highlightColor]="'red'"> I am red ! </p>

We can give the @Input() the same name as the directive, so we can bind using the directive itself
(like it is done for ngClass and ngStyle) :
  @Input('appBasicHighlight') highlightColor : string = 'blue';
So we can use it like this :
   <p [appBasicHighlight]="'red'"> I am red ! </p>
This obviously can be used only with a single @Input(), others need the normal binding.

Creating structural directives
------------------------------

The structural directives (which names start with *) are transformed by Angular to be included
in a <ng-template> element with a property equal to the directive name without the *.
To implement them, it is similar to attribute directives, but we now need to tell Angular what to
display, via 2 elements we can inject :
 - TemplateRef      : a reference to the template containing the content to display or not
 - ViewContainerRef : a reference to the container where the template is included

We can use a setter for the Input() to execute a method when it is set.
This method will decide whether or not to include the element in the view.
For ex, a directive "unless" that displays an element only if a condition is false :

@Directive { selector: '[appUnless]'}
export class UnlessDirective {
  // here we use a setter instead of a prop, so the method is called everytime "unless" is defined
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
        this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      // do not display the template, clear the view container
        this.vcRef.clear();
    }
  }

  // inject the template ref and the view container ref as properties
  constructor(private templateRef: TemplateRef, private vcRef : ViewContainerRef) {}
}

It can then be used like :
  <div *appUnless="shouldBeHidden"> XXX </div>



FORMS
-----

In usual web applications, forms send a request to the server, that will reply with an HTML page.
Since Angular applications are single-page applications, we need to handle the form ourselves.
If we want to reach out to a server, this will be done via the Angular HTTP service.
Angular offers great tools to check the form validity and handle the inputs.
It requires to import the FormsModule in the "imports" property of app.module.ts.

2 approaches are possible in Angular to use forms :
 - template-based : the "simple" approach, we define the form structure in HTML
                    Angular automatically creates a JS object representing our form and lets us manipulate it.
                    It is sufficient for most scenarios.
 - reactive       : we define manually the HTML structure and the JS and the bindings
                    more complex but allows more fine-tuning
                      -> dynamic controls
                      -> custom validators ...

Template-based approach
-----------------------

In our form, we need to let Angular know which controls it needs to include in the JS representation.
For that, we add the properties "ngModel" (with no param) and "name" to all our controls :
    <input type="text" id="username" class="form-control" ngModel name="username" />

By default, when a button with type="submit" inside a form is clicked, a submit event is triggered by JS.
Angular uses this behavior so instead of adding a (click) listener to our button, we add a (ngSubmit)
listener to our <form> tag.

We can then access the JS form representation by setting a local reference to the form and assigning it to
"ngForm" (the representation we want of our form), then give it to the TS method called on submit :
  <form (ngSubmit)="onSubmit(myForm)" #myForm="ngForm"> [...] </form>

From TS, we can access this NgForm object with a "value" attribute containing the controls's content:
  onSubmit(myForm: NgForm) {
    console.log(myForm.value);
  }

An alternative is to not pass a parameter to onSubmit(), but in the component get the form with @ChildView().
It is useful if we want to access the content of the form from outside the form :
  @ChildView('myForm') myForm: NgForm;

Validation
----------

We can add some built-in directives in our controls to define some validation :
  - required
  - email
  - maxlength="25"
  - pattern="[a-zA-Z ]*"

The result of the validation will be in the "valid" property of the NgForm TS object.
Angular also adds some CSS classes to the controls depending on their status :
 - ng-valid
 - ng-invalid
 - ng-dirty
 - ng-touched  (it was clicked but not necessarily modified)
 - ng-untouched
This lets us style invalid inputs for example :
  input.ng-invalid.ng-untouched { border: solid 1px red; }

We can also add an error message displayed only if the input is invalid.
This requires to give a local reference to the input of type ngModel :
  <input type="text" class="form-control" name="email" ngModel email #myEmail="ngModel" />
  <p class="help-block" *ngIf="myEmail.touched && !myEmail.valid"> Enter valid email </p>

The submit button can be disabled if the form is not valid :
  <input type="submit" class="btn btn-primary" [disabled]="!myForm.valid" />

Default value
-------------

We can add a default value to a control (input or select) with one-way binding of [ngModel].
For example for a select :

<select class="form-control" id="question" name="question" [ngModel]="'age'">
  <option value="age">How old are you ?</option>
  <option value="name">What is your name ?</option>
</select>

If we need to access the value from TS before the Submit button is clicked, we use 2 way bindings [(ngModel)].


Form Groups
-----------

We can group several controls together inside a form group in Angular with directive ngModelGroup.
Angular will take it into account when creating the NgForm object, each group will be a level
in the hierarchy with its own valid/touched/dirty... properties.

<form (ngSubmit)="onSubmit()" #myForm="ngForm">
  <div id="userInfo" ngModelGroup="ngInfo">
    <div class="form-group">
      <label for="username"> User Name </label>
      <input class="form-control" type="text" id="username" name="username" ngModel required />
    </div>
    <div class="form-group">
      <label for="password"> Password </label>
      <input class="form-control" type="text" id="password" name="password" ngModel required />
    </div>
  </div>
</form>

Just like single controls, we can use a local reference to display a validation message at group level.
  <div id="userInfo" ngModelGroup="ngInfo" #userInfo>
    [...]
  </div>
  <p *ngIf="userInfo.touched && userInfo.invalid">The User data are not valid ! </p>


Radio-button
------------
Radio button syntax is a bit strange, each option must be an input wrapped in a label.
All options are in a div with class "radio" :

<div id="myRadioContainer">
  <div class="radio">
   <label> <input type="radio" name="gender" value="H" ngModel /> Male </label>
   <label> <input type="radio" name="gender" value="F" ngModel /> Female </label>
  </div>
</div>

Update control value from TS
----------------------------

We can update control values with 2-way data binding [(ngModel)].
Angular also offers form-specific function to update either all the form values or specific ones.
For this we need to have a local reference #myForm on the form and retrieve it with @ChildView().
Then we can call :
  this.myForm.setValue({ userInfo: { username: 'Bob', password: '1234'}, email: 'aaa@aaa.com' });
  this.myForm.form.patchValue({ userInfo: { username: 'Bob' } });

We can also reset the form to the initial values and state (all CSS classes) with :
  this.myForm.reset();


Reactive approach
-----------------

With the reactive approach, we still define our form in the HTML, but we do not use the NgForm
representation that Angular creates automatically.
We need to import the ReactiveFormsModule inside out app.module.ts (instead of FormsModule).
Then we define a property "myForm" of type FormGroup (the NgForm is actually a wrapper above it).
We can populate it in the ngOnInit(), by defining the controls of the form.
In here there is no difference between input / select / radio inputs.
We can have a tree structure by adding other FormGroup elements inside the root FormGroup.

  ngOnInit() {
    this.myForm = new FormGroup({
      'userInfo': new FormGroup({
        'username': new FormControl('default name'),
        'password': new FormControl(null),
      }),
      'gender': new FormControl('H'),
    });
  }


Then in the HTML, we need to let Angular know that we want to link the form with our custom FormGroup :
  <form [formGroup]="myForm">

Then all controls need to have the "formControlName" directive to link to the name in TS :
  <input type="text" id="username" class="form-control" formControlName="username">

Similarly, the form groups inside the root must be represented by a div with "formGroupName" directive :
  <div formGroupName="userInfo">

On submit, it is very similar to the template-based version.
The form has a (ngSubmit) listener calling an onSubmit() function.
Now the onSubmit() function can access the forms values from the myForm object it created.

Validators on controls should not be in the HTML anymore, but in the TS form definition.
The FormControl() constructor takes a default value and the validator(s) to apply.
  new FormControl('default val', [Validators.required, Validator.email])

To display a message when a component is invalid, it is the same logic than for template-based,
but we use the "get" method of the FormGroup to access a given controller :
  <input type="text" id="username" class="form-control" formControlName="username">
  <span *ngIf="myForm.get('userInfo.username').touched && !myForm.get('userInfo.username')">Enter a valid name !</span>

We can also use some arrays of controllers, by declaring a FormArray inside the FormGroup.
Then it needs to be linked in the HTML with "formArrayName" property :

<div formArrayName="guests">
  <h1> Guests </h1>
  <button type="button" class="btn btn-primary" (click)="onAddGuest()"> Add Guest </button>
  <div class="form-group" *ngFor="let guest of myForm.get('guests').controls; let i = index">
    <input type="text" class="form-control" [formControlName]="i" />
  </div>
</div>

To add dynamically an empty element in the "guests" array from the TS code we need to do :
  newControl = new FormControl(null, Validators.required);
  (<FormArray>this.myForm.get('guests')).push(newControl);

Custom validator
----------------

Reactive approach lets us easily define our own validators.
We just need to implement a validator function and pass it to our FormControl() constructor :

  blacklistedGuests = ['Bob', 'Alice'];

  notBlacklisted(control: FormControl) : { [s: string]: boolean } {
    if (this.blacklistedGuests.indexOf(control.value) !== -1) {
      return { 'blacklistedName': true };
    }
    return null;
  }

And when we declare our guest controller we add this new validator.
ATTENTION !!  We need to bind "this" so JS knows what to use as this when it calls it !

  newControl = new FormControl(null, [Validators.required, this.notBlacklisted.bind(this)]);

Using error codes
-----------------

The error code is saved in the JS form object inside the component that causes the error.
This can be used to display a custome validation message depending on the error :

    <input type="text" class="form-control" [formControlName]="i" />
    <span *ngIf="myForm.get('username').touched && !myForm.get('username')">
      <span *ngIf="myForm.get('username').errors['required']"> Should not be empty ! </span>
      <span *ngIf="myForm.get('username').errors['blacklistedName']">  Blacklisted Name ! </span>
    </span>

Asynchronous Validation
-----------------------

An asynchronous validation can be added (reach out to backend via HTTP for ex) :

  nameForbidden(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>( (resolve, reject) => {
      setTimeout(() => {     // jsut to simulate a time-consuming function
        if (control.value == John'') {
          resolve({ 'forbiddenName': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }

In the declaration of the control, it should be added in the 3rd argument (bind "this" if used) :
  newControl = new FormControl(null, [Validators.required], [this.nameForbidden]);



PIPES
-----

Pipes can be used to transform some data in the output.
They are used with string interpolation to transform the value resolved in TS :
 {{ 'Hello' | uppercase }}     // will show HELLO

There are some built-in pipes :
  uppercase
  date               // show a date like 'Aug 12, 2017'
  json
  slice              // substring
  async              // used to force the watch of a Promise and update when it resolves

Some pipes can take parameters, given after a ":" sign :
  {{ myDate | date: 'fullDate' }}  // show a date like 'Monday, August 12, 2017'

Pipes can be chained :
  {{ myDate | date: 'fullDate' | uppercase }}


To define a custom pipe :
 - create a xxx.pipe.ts file
 - export a class implementing PipeTransform
 - give it the @Pipe() decorator with the 'name' property
 - add the pipe class in the 'declarations' array of the TS module file

  @Pipe({ name: 'firstLetters' })
  export class FirstLettersPipe implements PipeTransform {
    transform(value: any, size: number) {
      return value.substr(0, size);
    }
  }

Pipes can also be used in ngFor loops in the HTML code to filter the array we loop on:
<div *ngFor="let user of users | validUser"> [...] </div>

By default the pipe is not recalculated when the array changes (it would be high performance).
This means if new valid users are created, they would not be listed in the above example.
We can force Angular to recalculate the pipe on every change in the page by adding in the @Pipe() decorator :
  pure: false
It is not the default because that may slow down the app.


HTTP REQUESTS
-------------

To communicate with a backend, Angular can send some HTTP requests.
HTTP requests are made of :
 - a verb  : GET / POST / PUT / DELETE / PATCH ...
 - a URL   : /recipes/12/
 - headers : content-type, ...
 - a body  : the data to send (for POST / PUT / PATCH)

Here we use a Firebase project so we do not need to write our own backend.
Firebase gives us some endpoints to create/alter/delete objects.
See at the end for more info about Firebase.


Angular HTTP Module
-------------------

In Angular, we need to add the HttpClientModule in our main app.module,ts imports.
Once imported, we can inject the HttpClient from the constructor of our components.
This client offers a method per HTTP verb, for ex http.post(...).

These methods return observables, and Agular actually sends the HTTP request only if
someone subscribed to this observable.
They are generic, so we can specify the type of objects we retrieve.

// POST
this.http.post(backendApiUrl, requestBody)
    .subscribe(responseData => {
      console.log(responseData);
    });

// GET to same endpoint with an observable operator to transform the response
this.http.get<Post>(backendApiUrl)
    .pipe(map(responseData => {   // transform JSON response into an array
      const itemArray = [];
      for (key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          itemArray.push({ ...responseData[key], id: key });
        }
      }
      return itemArray;
    }))
    .subscribe(posts => {
      console.log(posts)
    });

To handle errors in the HTTP request, we can provide a 2nd param to the subscribe() method :

  this.get(url).subscribe(
    posts => { console.log(posts); },
    error => { console.log(error.message); }
  );

To pass custom headers, we have an optional config object in all get/post/delete methods :
  this.get(url, { headers: new HttpHeader({ my-header: 'XXX' }) })
      .subscribe( responseData => { ... } );

To pass query parameters, we can either :
  - add it to the url : https://myrecipes-4a862.firebaseio.com/items.json?print=pretty
  - add it in the "params" field of the config object :
  this.get(url, { params: new HttpParams().set('print', 'pretty') })

By default, Angular gives us the response body in our subscribe method.
We can change this behavior to get the full response (with headers, response code) with the
'observe' field of the config object, it can take values :
  - 'body'     : body of the HTTP response (default)
  - 'response' : full HTTP response
  - 'events'   : catches all messages going out an in, they are "events" with a type (HttpEventType enum)
                 for ex type 0 is "Sent", type 4 is "Response" and is the actual HttpResponse.
                 THis is the most fine-grain level of observation.

  this.get(url, { observe: 'response' })
      .subscribe( (response: HttpResponse) => { ... } );

  this.get(url, { observe: 'events' })
      .subscribe( event => {
         if (event.type == HttpEventType.Sent) {
           console.log('HTTP request was sent !');
         } else if (event.type == HttpEventType.Response) {
           console.log('HTTP response received : ');
           console.log(event.body);
         }
       });

By default, Angular converts the response body in JS object.
We can change it by setting in the config object the field 'reponseType' to 'text' ('json' by default).
Angular would then keep it as a string.


HTTP Interceptors
-----------------

So far we have set headers / body at request level.
We may want to attach a header to all our requests (for ex an auth token).
It would be annoying to add the logic in every HTTP request we create.
Angular offers interceptors that intercept all requests before they are sent and can alter them before sending.

An interceptor is a service implementing HttpInterceptor interface :

  export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      // clone our HTTP request (req is immutable)
      const myReq = req.clone({
          headers: req.headers.append(auth, XXXX'}),     // if we want to add headers
          url: '<another URL>'                           // if we want to change the URL
      })
      // call the handler (REQUIRED!)
      return next.handle(myReq);
    }
  }

The interceptor needs to be added in the app.module.ts providers in a special way :
  providers: [{
    provide:  HTTP_INTERCEPTORS,         // constant token to tell Angular it is an interceptor
    useClass: AuthInterceptorService,
    multi:    true                       // to not overwrite other interceptors if any
  }], ...

Angular will run it on every HTTP request leaving the app.
If we want to restrict to only GET for ex, we need to add the logic inside the intercept method.

We can also intercept all HTTP responses coming in the app.
We use the same interceptor as above, but we add a pipe() to the returned observable.
This pipe always receive an "event" response type (the most granular) :

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      myReq = req.clone({ ... });
      next.handle(myReq).pipe(tap( event => {
        console.log(event);
      }));
    }


AUTHENTICATION
--------------

Many apps use sessions for authentication.
Session are an object that is created in the backend once the user enters his credentials.
The backend then "knows" the client as long as the session is open.

With Angular we cannot use this mechanism, since frontend and backend are totallyy decorrelated.
They only communicate via HTTP calls.

In Angular, once the client sends the credentials, the backend will generate a token from them,
encode it with a secret key only the backend knows, and sends it to the Angular frontend.
Every time the client sends a request that needs authentication, it will attache this token.
The backend will then validate that it is correct, and if it is accept to execute the request.

The backend needs to have an HTTP endpoint to create a user, and to get a token for an existing user.
We can use Firebase that provides this service out-of-the box without writing our own backend.

The Angular app must have a login form allowing the user to :
 - create an account
 - login with an existing account
 - log out

It should then communicate with an Auth service that handles the sign up / log in / log off.

If we want to store the auth token so that it is read when the page reloads, we need to use either
cookies or local storage (an API controlled by the browser to store key/val pairs on the file system).

To store with local storage we need to convert the object to store into a string :
localStorage.setItem('itemName', JSON.stringify(myObject));

It can be read at startup and removed on logout with :
localStorage.getItem('itemName');
localStorage.removeItem('itemName');

We can see the content of local storage in the Chrome dev tool (Application > Storage > Local Storage).


DYNAMIC COMPONENTS
------------------

We can load some components dynamically in our app, to create some modals or popups for example.
One way to do it is to use *ngIf on a component with a backdrop, and to set the condition in code to show/hide it.
It is the easiest solution so it should be used when possible.

A more complex approach is to create the component, attach it in the DOM and remove it from the DOM ourselves from code.

We need a method in the TS code to instanciate our component.
We cannot just use "new MyComponent()" because Angular needs more than just instantiation.

We need to use an Angular Component factory.
Inject the ComponentFactoryResolver in the constructor, then instantiate the component like :
  const factory = this.componentFactoryResolver.resolveComponentFactory(MyComponent);

This factory needs to know where to create the component, which is given by a view container ref.
It is obtained by creating a directive, inject in it the "ViewContainerRef" and make it a public porperty of the directive.
Doing so, we can set this property to a <ng-template> in the HTML and access its view container ref to create the component here.

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

Then create a <ng-template> element in the HTML of the component that will create the new component dynamically.
It is better than a <div> because it does not actually create an element in the DOM, but can be referenced.
Add the new directive to that element :
  <ng-template appPlaceholder></ng-template>

Then we can access the view container ref from the code with @ViewChild :
  @ViewChild(PlaceholderDirective, {static: false}) errorModalTemplate: PlaceholderDirective;

And use it to create a component dynamically :
    const factory = this.factoryResolver.resolveComponentFactory(AlertComponent);
    const viewContainerRef = this.errorModalTemplate.viewContainerRef;
    viewContainerRef.clear();
    const newComponentRef = viewContainerRef.createComponent(factory);

For this to work, we need to let Angular know that this component will be created dynamically.
This is done by registering it in the "entryComponents" property of the module :
  entryComponents: [AlertComponent]

Then we can set the input and output bindings by using the "instance" of the new component ref.
    modalRef.instance.message = message;                              // input
    this.modalCloseSub = modalRef.instance.close.subscribe(           // output close eventSubmitter
      () => {
        this.modalCloseSub.unsubscribe();
        viewContainerRef.clear();
      }
    );


STATE MANAGEMENT WITH REDUX
---------------------------

Application state contains all not-persistent information used to know what should
be displayed (loading, tab selected, just sent a file, ...).
We can handle state only with services and components, by having a service that publish
state change (with a Subject) and components subscribing to it.

For bigger apps, having one centralized place to manage the application state makes the
code easier to read and maintain. We can use Redux for this.

Redux is a pattern to manage state, using a central JS object called "store" that will
be the source of truth for services/components regarding the application state.

To update the state (for ex add a recipe), we cannot modify the store directly.
We need to create an action that defines how to change the store, and add an optional payload.
This action is processed by a "reducer" that will calculate the resulting state, and will
overwrite the current store with the new state.
This implies that every change of the state creates a new version of the store.
The new state is then received by every component needing it by a subscription.

The angular wrapper for Redux is called "NgRx" and implements this Redux pattern using
rxjs (Subjects) and making it easy to subscribe to the store from a service.

Install with:  $>  npm install --save @ngrx/store
               $>  npm install --save @ngrx/effects   (for side effects)

Actions
-------
An action must be defined for each type of change we can do on the store.
We can group actions in an xxx.actions.ts file.
Actions must implement the "Action" interface by providing a "type" property:

export class AddIngredientAction implements Action {
  readonly type = ADD_INGREDIENT;
  payload: Ingredient;
}

Reducers
--------
Reducers are functions that will be called by Redux to compute the next state.
Redux provides the original state and the triggered action.
Create a file xxx.reducer.ts and define a reducer function :

  export function ShoppingListReducer(
      state = initialState,
      action: AddIngredientAction) {
    switch (action.type) {
      case ADD_INGREDIENT:
      return {
        // copy all properties of state into the new object
        ...state,
        // overwrite the properties we want to change
        ingredients: [...state.ingredients, action.payload]
      };
  }

Store
-----
Import in the app.module.ts the StoreModule and list its reducers :
    StoreModule.forRoot({ shoppingList: ShoppingListReducer })
With this setup, NgRx creates an application store with the given reducers.
We can access it by injecting in a module/component an object of class Store.
Store is generic, and needs to specify the actual full type of the store :
      private store: Store<{shoppingList: {ingredients: Ingredient[]}}>

Then we can access the observable for a sub-store with :
  this.subscription = this.store.select('shoppingList').subscribe(
    (shoppingListStore: {ingredients: Ingredient[]}) => {
      this.ingredients = shoppingListStore.ingredients;
    });

Call an action
--------------
Inject the Store and call its dispatch() method :
  this.store.dispatch(new AddIngredientAction(payload));
This will automatically be executed by all reducers.

Side effects
------------
The reducers should not contain any side effects, they should only set the state.
NgRx offers a way to handle side effects (REST calls, local storage management).
We can create some new effect actions in xxx.actions.ts, that do not update the state but trigger effects.
Actions updating the state are handled in the reducer files.
Actions triggering effects are handled in a xxx.effects.ts file.
The xxxEffects class needs @Injectable() decorator, and its constructor injects the Actions object
(from ngrx/effects, usually called "actions$").
This lets us react to some actions, and trigger another action if needed.
We create effect observables (with @Effect() decorator) that NgRx will automatically call when
an action of one (or several) given types is dispatched :

  @Effect({dispatch: true / false})
  myEffect = this.actions$.pipe(
        ofType(MY_ACTION),         // filter on a given action (or set of actions)
        // IF NO ACTION TO DISPATCH
        tap( (myAction: xxxAction) => { ... } )
        // IF ACTION TO DISPATCH SYNCHRONOUSLY
        map( myAction: xxxAction => {
          ... my sync effects ...
          // then return an action
          return new yyyAction(params));
        })
        // IF ACTION TO DISPATCH ASYNCHRONOUSLY
        switchMap(                 // replace by another observable
          myAction: xxxAction => {
            this.http
            .post<TYPE>(url, params)
            .pipe(
              map( myHttpRes => {   // applied on success
                // return the next action to trigger (ngrx dispatches it)
                return new yyyAction(params);
              }),
              catchError( err =>{  // MUST return a valid observable to not kill the effect observable
                 return of( new NoAction() );
              }
            )
          })
  );

We can create effects that do not displatch another action, for ex if we just want to navigate
to a page when an action is triggered.
We need to specify it in the @Effect() decorator:
  @Effect({ dispatch: false })
  myEffect = this.actions$.pipe(
    ofType(MY_ACTION),
    tap( action => { this.router.navigate(URL); } )
  )

In the app.module.ts, we need to import module EffectsModule and set our effects class:
   EffectsModule.forRoot([xxxEffects])

NgRx dev tools
--------------
We can use a chrome extension to debug our Redux state.
This extension shows all actions triggered, and the state after each of them.
 -> Download the "Redux DevTools" Chrome extension
 -> Install the ngrx dev tool package as a dev dependency :
      $>  npm install --save-dev @ngrx/store-devtools
 -> In app.module.ts, import StoreDevToolsModule :
      StoreDevToolsModule.instrument({ logOnly: environment.production })
 -> Relaunch Chrome and "ng serve", now we have a "Redux" section in the chrome dev tools.

Another useful NgRx feature is the Router Store.
It triggers an NgRx action everytime the Angular router navigates to a page.
This lets us change the state of the app on routing events.
To use it, install the router store package :
      $>  npm install --save @ngrx/router-store
Then add in the imports of the app.module.ts :
      StoreRouterConnectingModule.forRoot(),
Now after "ng serve" the redux chrome extension should show an action at every routing event.


Bonus JS : Observables
----------------------

Angular uses a lot Observables (from rxjs library), for example this.activatedRoute.params.
It is used a lot in JS, for example with HTTP requests as well.
It can complete (like HTTP requests) or never complete (like intervals).
We can subscribe to an Observable and give it a method to call on event, error and completion :

this.route.params.subscribe(
  (params: Params) => { console.log(params); },
  (error)          => { console.log(error); },
  ()               => { console.log("Completed"); },
);

If we create our own Observables, we need to unsubscribe from them in the OnDestroy().
Otherwise the will keep reacting on the observable changes, causing memory leaks.
We do not  need to unsubscribe from Angular-specific observables though, because
Angular automatically unsubscribe from them.

We can use an "operator" to modify the data received by an observable before we get it.
This is done by calling pipe() on the observable, applying some pipe operators and subscribing to their result.
The most popular operator are :

- map() that lets us give a function to apply to the data :

this.route.params
    .pipe(map( (data) => { return 'ID_' + data; } ))
    .subscribe( (data) => { console.log(data); } )
);

- tap() that lets us run a function without altering the data
  It returns nothing, and can be used for analytics or logging

- filter() that lets us select only the data we want to receive :

this.route.params
    .pipe(filter( (data) => { return (+data < 3); } ))
    .subscribe( (data) => { console.log(data); } )
);

- take(n) lets rxjs know that we want only n values from that observable.
  once we received the desired number of values, it automatically unsubscribes.

- catchError() that lets us process any error sent by the observable.
  it should throwError(error) if it wants to forward the error

Subjects
--------

Subjects are a special type of Observables that we can trigger manually with next(val).

In the service  :  eventSubject = new Subject<boolean>();
In the caller   :  this.myService.eventSubject.next(true);
In the listener :  this.myService.eventSubject.subscribe((event: boolean) => { ...} );

Like every Observable, the listener must unsubscribe in his OnDestroy hook.
We should use them insted of EventEmitter for inter-components communication via a service,
but it can not replace the EventEmitter in the @Output() Angular decorator.

We can also use BehaviorSubject objects, that are similar to Subjects but we can access the
last emitted value even if we subscribe after it was emitted.
    eventSubject = new BehaviorSubject<boolean>(null);


USEFUL TOOLS
------------

Visual studio Code
------------------

Free IDE with good Angular support.
Use extension "Angular Essentials" from John Papa (bundle of useful extensions).

Augury
------

Chrome browser extension to debug Angular app.

Bootstrap
---------

Bootstrap offers a large selection of CSS classes to style our components easily.
Install locally and save to package,json with :
npm install --save bootstrap@3
npm install --save jquery

Then update the "styles" and "scripts" arrays in angular.json :
	"styles": [
	  "node_modules/bootstrap/dist/css/bootstrap.min.css",
	  "src/styles.css"
	],
	"scripts": [
	  "node_modules/jquery/dist/jquery.js",
	  "node_modules/bootstrap/dist/js/bootstrap.js"
	]

Useful class provided by bootstrap :

  container          space above and below, fixed width (depending on screen size), 15px padding
  container-fluid    space above and below, 100% width, 15 px padding

  Grid structure (up to 12 columns) :
    row              fills 100% of the container
    col              let Bootstrap decide the size, all cols will have the same width
    col-sm-3         use 3 columns out of the 12 available, sm is for small screens support
                     when getting too small, the columns will stack on each other

  form-controler    set size and width of a text input
  btn               empty button with size and radius
  btn-primary       blue color button (completes btn)
  text-white        Write the text in white
  bg-XXX            colored bg, XXX can be primary/success/info/warning/danger/secondary/white/dark/light
  text-XXX          colored text, XXX can be the same as above
  bg-dark           grey background
  bg-primary        blue background

  Bootstrap customizes some html tags :
  <h1> to <h6>      specific font + size
  <small>           smaller text
  <mark>            yellow bg and padding
  <code>            fixed width font in pink
  <kbd>             for commands, white text on black bg with radius


Loading.io
----------

A nice website offering some spinners (HTML and CSS).
We can create a component with this copy/pasted code to have a ready to use spinner component.

Angular Universal
-----------------

The code of an Angular app contains only the <app-root> component and a bunch of scripts.
This works well for the user but is not easily understood by search engines.
Angular Universal lets us create a server that pre-renders our pages and sends them to the
browser (with the full HTML structure) for the search engines to be able to parse it.
Guide : https://github.com/angular/angular-cli/wiki/stories-universal-rendering

It requires to :
 - import some new dependencies (especially angular platform for building server side app)
 - add a new module for the server side
 - add some config in angular.json to allow a "server" build command
 - import express and create a "server.ts" express server side process
 - convert it to JS with webpack

 This can no longer be served by a static files web server (like AWS S3).
 It needs a web server that can execute a node.js app (to run the server.js file).

Firebase
--------

In a real app, the backend can be in C++ / Java / Node / Python.
To simulate the backend, we can use Firebase, a Google backend-as-a-service solution.
It offers a lot of backend functionalities (authentication, database, storage, REST API).
We will just use here the REST API to define HTTP endpoints for our Angular app.
We will create a Firebase project, which is a container for several apps sharing backend (iOS / Android / web).
A Firebase project is actually creating a Google Cloud Platform (GCP) project behind the scene.

We will use Firebase Realtime database, it is a database that stores and gets objects directly via HTTP calls.
When sending a POST, it is interpreted by Firebase to add an element in a folder of this database.

- open the Firebase Console
- Click "Create a Project" and give it a name ("myRecipes" in my example)
- Once the project is created, we are on the overview dashboard of the project.
- Go to Develop > Database > Create Real-time database (not Cloud Firestore)
  Click "Set test mode" to allow anyone to do anything in the DB (later we will use authentication)

Data tab:
It creates a database and provides us with a base URL : https://mytest-4d456.firebaseio.com/
We can execute HTTP requests on it, by adding a relative path at the end, for example :
https://mytest-4d456.firebaseio.com/items.json
NOTE : Firebase requires that we add the ".json" at the end to tell it the type.
On a post, it will create a new element in the items folder with a unique ID (name).

Rules tab:
We can define the permission on read and write.
Set the read permission to false to receive an error on any GET (to test error handling).

Authentication

Firebase also offers an authentication mechanism to create users and provide auth tokens.
The simplest setup is to allow users to do anything they want if they are authenticated.
We do not have ownership of resources here (we should add the owner in every resource if we had).
We can set the Database rules to be :
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
This will now send a 401 error to anyone hitting the endpoint without being authentified.

In the "Authentication" tab, click on "Setup sign-in method", choose Email/Password and ensure "Enable" is selected.
Once this is setup, we can see our users under the "Users" tab (originally empty of course).
Infos on the auth endpoint by searching "Firebase Auth API" in Google.
It is a dedicated API, completely unrelated with our real-time database.

Signup : https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
API_KEY is the web API key of our project, found in : Project Overview > Project Setup > Web API key

