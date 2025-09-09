import { PointType } from '../../types';
import { useEffect, useState } from 'react';
import { PointTypeRepository } from '../../database/repositories/point-type-repository';

export function usePointTypes() {

    const [pointTypes, setPointTypes] = useState<Array<PointType>>([]);
    const repo = new PointTypeRepository();

    const get = (): void => {
        const data = repo.get() ?? [];
        setPointTypes(data);
    }


    useEffect(() => {
        get();
    }, [])

    return { 
        pointTypes,
        get,
    };
}
