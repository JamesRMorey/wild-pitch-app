import { useRef } from 'react';


export function useDebouncedCallback() {

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    function debounce(callback: (...args: any[]) => void, delay: number) {
		function debounced(...args: any[]) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		}

		return debounced;
	}

	const cancel = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

    return { 
        debounce,
        cancel
    };
}
