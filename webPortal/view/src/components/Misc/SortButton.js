import React from "react";
import Button from 'react-bootstrap/Button'

const SortButton = ({id, handleSort, btnSort}) =>
    <Button id={id} className="btn-sort text-light" variant="link" onClick={handleSort}>
        <span >
            <i id={id} className={btnSort}></i>
        </span>
    </Button>;

export default SortButton;