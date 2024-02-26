import {Moon, Sun} from 'lucide-react';
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";

export const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.getElementsByTagName("html")[0].setAttribute('data-bs-theme', theme)
    }, [theme])

    return (
        <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant={"outline-secondary"}
        >
            {
                theme === 'light' ?
                    <Sun className=""/> :
                    <Moon className=""/>
            }
        </Button>
    );
}
