
interface ClusterFunctionType {
    propertyKey: string | symbol;
    opts: any;
}


export function ClusterFunction(opts = {}): MethodDecorator {
    return ((target, propertyKey, descriptor) => {
        let ClusterFunctions: ClusterFunctionType[] = Reflect.getMetadata('ClusterFunctions', target);

        if (!ClusterFunctions) {
            ClusterFunctions = [];
        }

        ClusterFunctions.push({
            propertyKey,
            opts
        });

        Reflect.defineMetadata('ClusterFunctions', target, ClusterFunctions);
    });
}
