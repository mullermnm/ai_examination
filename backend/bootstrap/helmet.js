import helmet from 'helmet'

function helmetEncapsulation(app) {
    // helmet Encapsulation Policy Implemented to secure the Incomming headers');
    app.use(helmet.contentSecurityPolicy());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.expectCt());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.xssFilter());
    app.use(
        helmet({
            referrerPolicy: {
                policy: "no-referrer"
            },
        })
    );

    //..........

}
export default helmetEncapsulation;