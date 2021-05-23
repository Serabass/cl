
export interface ClusterFunctionType {
    propertyKey: string | symbol;
    opts: any;
}

export function ClusterFunction(opts = {}): MethodDecorator {
    return ((target, propertyKey, descriptor) => {;
        let trg = target.constructor;
        let ClusterFunctions: ClusterFunctionType[] = Reflect.getMetadata('ClusterFunctions', trg);

        if (!ClusterFunctions) {
            ClusterFunctions = [];
        }

        ClusterFunctions.push({
            propertyKey,
            opts
        });

        Reflect.defineMetadata('ClusterFunctions', trg, ClusterFunctions);
    });
}
