import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import client from './client';

// Head Component to set document title
export function Head({ title, children }) {
    useEffect(() => {
        if (title) {
            document.title = title;
        } else if (children) {
            // If title is passed as child tag <title>Title</title>
            const titleTag = React.Children.toArray(children).find(
                child => child.type === 'title'
            );
            if (titleTag && titleTag.props.children) {
                document.title = titleTag.props.children;
            }
        }
    }, [title, children]);

    return null;
}

// Custom Link that acts like Inertia Link
export function Link({ href, method = 'get', data = {}, as = 'a', onClick, children, ...props }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = async (e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;

        e.preventDefault();

        const activeMethod = method.toLowerCase();
        if (activeMethod === 'get') {
            let query = '';
            if (data && Object.keys(data).length > 0) {
                query = '?' + new URLSearchParams(data).toString();
            }
            navigate(href + query);
        } else {
            // Mutation methods (POST, PUT, DELETE, PATCH)
            try {
                const res = await client({
                    method: activeMethod,
                    url: href,
                    data
                });
                if (window.routerReload) window.routerReload();
            } catch (err) {
                console.error(`Link mutation failed: ${activeMethod} ${href}`, err);
            }
        }
    };

    if (as === 'button') {
        return (
            <button onClick={handleClick} {...props}>
                {children}
            </button>
        );
    }

    return (
        <RouterLink to={href} onClick={handleClick} {...props}>
            {children}
        </RouterLink>
    );
}

// usePage hook to emulate Inertia's page attributes
export function usePage() {
    const location = useLocation();
    
    // Retrieve authenticated user from local storage dynamically
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) user = JSON.parse(storedUser);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
    }

    return {
        url: location.pathname + location.search,
        props: {
            auth: { user },
            flash: {},
            errors: {},
        }
    };
}

// Router object for programmatically calling requests and navigation
export const router = {
    visit: (url) => {
        if (window.routerNavigate) {
            window.routerNavigate(url);
        } else {
            window.location.href = url;
        }
    },
    get: (url, data = {}, options = {}) => {
        let query = '';
        if (data && Object.keys(data).length > 0) {
            query = '?' + new URLSearchParams(data).toString();
        }
        if (window.routerNavigate) {
            window.routerNavigate(url + query);
        } else {
            window.location.href = url + query;
        }
    },
    post: (url, data = {}, options = {}) => submitRequest('post', url, data, options),
    put: (url, data = {}, options = {}) => submitRequest('put', url, data, options),
    patch: (url, data = {}, options = {}) => submitRequest('patch', url, data, options),
    delete: (url, options = {}) => submitRequest('delete', url, {}, options),
};

async function submitRequest(method, url, data = {}, options = {}) {
    if (options.onBefore) options.onBefore();
    if (options.onStart) options.onStart();

    try {
        const res = await client({
            method,
            url,
            data
        });
        
        if (options.onSuccess) options.onSuccess(res);
        if (window.routerReload) window.routerReload();
    } catch (err) {
        console.error(`router.${method} request failed`, err);
        if (options.onError) options.onError(err.response?.data?.errors || err);
    } finally {
        if (options.onFinish) options.onFinish();
    }
}

// useForm hook to manage forms and emulate Inertia's useForm hook
export function useForm(initialValues = {}) {
    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const transformRef = useRef((d) => d);

    const reset = (...fields) => {
        if (fields.length === 0) {
            setData(initialValues);
        } else {
            setData(prev => {
                const next = { ...prev };
                fields.forEach(field => {
                    next[field] = initialValues[field];
                });
                return next;
            });
        }
    };

    const clearErrors = (...fields) => {
        if (fields.length === 0) {
            setErrors({});
        } else {
            setErrors(prev => {
                const next = { ...prev };
                fields.forEach(field => delete next[field]);
                return next;
            });
        }
    };

    const transform = (callback) => {
        transformRef.current = callback;
    };

    const submit = async (method, url, options = {}) => {
        setProcessing(true);
        setErrors({});
        if (options.onBefore) options.onBefore();
        if (options.onStart) options.onStart();

        try {
            const transformedData = transformRef.current(data);
            
            // Support Multipart Form Data for file uploads
            let payload = transformedData;
            let headers = {};

            const hasFile = Object.values(transformedData).some(
                val => val instanceof File || val instanceof Blob
            );

            if (hasFile) {
                payload = new FormData();
                Object.entries(transformedData).forEach(([key, val]) => {
                    if (val !== null && val !== undefined) {
                        if (val instanceof File || val instanceof Blob) {
                            payload.append(key, val);
                        } else if (typeof val === 'boolean') {
                            payload.append(key, val ? '1' : '0');
                        } else {
                            payload.append(key, val);
                        }
                    }
                });
                headers['Content-Type'] = 'multipart/form-data';
            }

            const res = await client({
                method,
                url,
                data: payload,
                headers
            });

            if (options.onSuccess) options.onSuccess(res);
            if (window.routerReload) window.routerReload();
        } catch (err) {
            console.error(`Form submission failed: ${method} ${url}`, err);
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors || {});
            }
            if (options.onError) options.onError(err.response?.data?.errors || err);
        } finally {
            setProcessing(false);
            if (options.onFinish) options.onFinish();
        }
    };

    return {
        data,
        setData: (key, value) => {
            if (typeof key === 'object') {
                setData(prev => ({ ...prev, ...key }));
            } else {
                setData(prev => ({ ...prev, [key]: value }));
            }
        },
        errors,
        processing,
        reset,
        clearErrors,
        transform,
        post: (url, options) => submit('post', url, options),
        put: (url, options) => submit('put', url, options),
        patch: (url, options) => submit('patch', url, options),
        delete: (url, options) => submit('delete', url, options),
    };
}
