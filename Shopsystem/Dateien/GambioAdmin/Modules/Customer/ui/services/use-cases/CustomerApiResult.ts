type CustomerApiOk<T> = {
    success: true;
    value: T;
};

type CustomerApiErr<E> = {
    success: false;
    error: E;
};

export type CustomerApiResult<T, E> = CustomerApiOk<T> | CustomerApiErr<E>;