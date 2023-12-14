import {Moon, Sun} from 'lucide-react';
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";

export const ThemeToggle = ({children}: { children: React.ReactElement }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.getElementsByTagName("html")[0].setAttribute('data-bs-theme', theme)
    }, [theme])

    return (
        <div>
            <Button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="position-fixed z-1 m-3 mt-5"
                variant={"outline-secondary"}
            >
                {
                    theme === 'light' ?
                        <Sun className=""/> :
                        <Moon className=""/>
                }
            </Button>
            {children}
        </div>
    );
}
