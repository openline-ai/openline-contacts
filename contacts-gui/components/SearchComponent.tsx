import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {OverlayPanel} from "primereact/overlaypanel";
import {Skeleton} from "primereact/skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from "primereact/button";

const SearchComponent = (props: any) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<OverlayPanel>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    // classess used to make the element active
    const initialContainerClassName = "p-dropdown w-full flex";
    const selectedContainerClassName = " p-focus";
    const [currentContainerClassName, setCurrentContainerClassName] = useState(initialContainerClassName);

    const initialSelectedItemClassName = " p-dropdown-label p-inputtext w-full";
    const selectedItemEmptyClassName = " p-dropdown-label-empty";
    const [selectedItemClassName, setSelectedItemClassName] = useState(initialSelectedItemClassName + (!props.value || props.value === '' ? selectedItemEmptyClassName : ''));

    const [loadingData, setLoadingData] = useState(false);

    const [searchResultList, setSearchResultList] = useState([] as any);
    const [totalElements, setTotalElements] = useState([] as any);

    const [inputValue, setInputValue] = useState(props.value);

    useEffect(() => {
        setInputValue(props.value === '' ? 'empty' : props.value);
    }, [props.value]);

    let onClick = (e: any) => {
        setCurrentContainerClassName(initialContainerClassName + selectedContainerClassName);

        overlayRef?.current?.show(e, null);

        setLoadingData(true);
        setTimeout(() => {
            props.searchData(e.target.value, props.maxResults).then((response: any) => {
                setSearchResultList(response.content);
                setTotalElements(response.totalElements);
                setLoadingData(false);
            })
        }, 2000);
    };

    const onClear = () => {
        overlayRef?.current?.hide();
        setSelectedItemClassName(initialSelectedItemClassName + selectedItemEmptyClassName);
        props.onItemSelected(undefined);
    };

    return <>

        <div ref={containerRef} className={currentContainerClassName} onClick={onClick}>
            <span ref={labelRef} className={selectedItemClassName}>{inputValue}</span>

            {
                inputValue !== 'empty' &&
                <span className="flex align-items-center pl-2 pr-2" style={{color: 'black'}} onClick={onClear}><FontAwesomeIcon icon={faTimes}/></span>
            }

            <div className="flex align-items-center p-dropdown-trigger" onClick={(e: any) => labelRef?.current?.click()}>
                <span className="p-dropdown-trigger-icon p-clickable pi pi-chevron-down"></span>
            </div>
        </div>

        <OverlayPanel ref={overlayRef} style={{width: '500px'}} onHide={() => setCurrentContainerClassName(initialContainerClassName)}>

            {
                loadingData &&
                <div className="p-4">
                    <ul className="m-0 p-0">
                        <li className="mb-3">
                            <div className="flex">
                                <div style={{flex: '1'}}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                        <li className="">
                            <div className="flex">
                                <div style={{flex: '1'}}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            }

            {
                !loadingData &&
                <div className="mb-3">

                    {
                        searchResultList.map((c: any) => {
                            return (
                                <div key={c.id}>
                                    {
                                        props.itemTemplate(c)
                                    }
                                    <Button className="p-button-text p-0" onClick={() => {
                                        props.onItemSelected(c);
                                        overlayRef?.current?.hide();
                                        setSelectedItemClassName(initialSelectedItemClassName);
                                    }}>
                                        <FontAwesomeIcon size="xs" icon={faCirclePlus} style={{color: 'black'}}/>
                                    </Button>
                                </div>
                            );

                        })
                    }

                </div>
            }

            {
                !loadingData && (totalElements >= props.maxResults) &&
                <>
                    <div>{totalElements} elements match your search term</div>
                    <div>Improve your search term to narrow down the results</div>
                </>
            }

        </OverlayPanel>

    </>;
}

SearchComponent.propTypes = {
    value: PropTypes.string,
    searchData: PropTypes.func,
    itemTemplate: PropTypes.func,
    maxResults: PropTypes.number,
    onItemSelected: PropTypes.func
}

SearchComponent.defaultProps = {
    maxResults: 25,
    value: 'empty'
}

export default SearchComponent
