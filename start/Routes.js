
const Route = ioc.resolve('Route');

Route.get('/home', (req, res) => {
    res.json({
        foo: 'bar'
    });
});

Route.group('/api', (Route) => {
    
    Route.get('/users', (req, res) => {
        res.json([
            {
                id: 1,
                name: 'Jane Doe'
            }
        ]);
    });
    
    Route.group('/v1', (Route) => {
        Route.get('/users', (req, res) => {
            res.json([
                {
                    id: 1,
                    name: 'Jane Doe'
                }
            ]);
        });
    });

    Route.group('/v2', (Route) => {
        Route.get('/users', (req, res) => {
            res.json({
                1: {
                    id: 1,
                    name: 'Jane Doe'
                }
            });
        });
    });
});