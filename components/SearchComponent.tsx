import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {OverlayPanel} from "primereact/overlaypanel";
import {Skeleton} from "primereact/skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faSearchPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";

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

    const [displayValue, setDisplayValue] = useState(props.value);
    const [filters, setFilters] = useState(props.searchBy.map((sb: any) => {

    }));

    useEffect(() => {
        setDisplayValue(props.value === '' ? 'empty' : props.value);
    }, [props.value]);

    let onClick = (e: any) => {
        setCurrentContainerClassName(initialContainerClassName + selectedContainerClassName);

        overlayRef?.current?.show(e, null);

        setLoadingData(true);
        setTimeout(() => {
            props.searchData(filters, props.maxResults).then((response: any) => {
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

        {
            props.triggerType === "dropdown" &&
            <div ref={containerRef} className={currentContainerClassName} onClick={onClick}>
                <span ref={labelRef} className={selectedItemClassName}>{displayValue}</span>

                {
                    displayValue !== 'empty' &&
                    <span className="flex align-items-center pl-2 pr-2" style={{color: 'black'}} onClick={onClear}><FontAwesomeIcon icon={faTimes}/></span>
                }

                <div className="flex align-items-center p-dropdown-trigger" onClick={(e: any) => labelRef?.current?.click()}>
                    <span className="p-dropdown-trigger-icon p-clickable pi pi-chevron-down"></span>
                </div>
            </div>
        }

        {
            props.triggerType === "button" &&
            <Button onClick={onClick} className='p-button-text'>
                <FontAwesomeIcon icon={props.buttonIcon} className="mr-2"/>{props.buttonLabel}
            </Button>
        }

        <OverlayPanel ref={overlayRef} style={{width: props.overlayWidth}} onHide={() => setCurrentContainerClassName(initialContainerClassName)}>

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
                <div className="p-2 mb-3 w-full">

                    {
                        props.searchBy.length === 0 &&
                        <div className="font-bold uppercase w-full mb-3">{props.resourceLabel}</div>
                    }

                    {
                        props.searchBy.length > 0 &&
                        <div>

                            <div className="w-full mb-3">Search <span className="font-bold lowercase">{props.resourceLabel}</span> by</div>

                            <div className="flex flex-row">

                                <div className="flex flex-grow-1 flex-column">
                                    {
                                        props.searchBy?.map((f: any) => {
                                            return (
                                                <>
                                                    <div className="flex flex-row mb-3">

                                                        <span className="flex flex-grow-0 mr-3">
                                                            {f.label}
                                                        </span>
                                                        <span className="flex flex-grow-1 mr-3">
                                                            <InputText className="w-full" onChange={(e: any) => {
                                                            }}/>
                                                        </span>

                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex align-items-center">
                                    <Button className="p-button-text">
                                        <FontAwesomeIcon size="sm" icon={faSearch}/>
                                    </Button>
                                </div>

                            </div>
                        </div>
                    }

                    {
                        searchResultList.map((c: any) => {
                            return (
                                <div key={c.id} className="flex search-component-row p-2">
                                    <div className="flex flex-grow-1">
                                    {
                                        props.itemTemplate(c)
                                    }
                                    </div>
                                    <div className="flex pr-2">
                                         <FontAwesomeIcon size="lg" icon={faSquarePlus}/>
                                    </div>
                                </div>
                            );

                        })
                    }

                </div>
            }

            {
                !loadingData && (totalElements > props.maxResults) &&
                <>
                    <div>{totalElements} elements match your search term</div>
                    <div>Improve your search term to narrow down the results</div>
                </>
            }

        </OverlayPanel>

    </>;
}

SearchComponent.propTypes = {
    resourceLabel: PropTypes.string,
    overlayWidth: PropTypes.string,
    triggerType: PropTypes.oneOf(["dropdown", "button"]),

    //search with button
    buttonLabel: PropTypes.string,
    buttonIcon: PropTypes.any,
    searchBy: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        field: PropTypes.string
    })),

    //search with dropdown
    value: PropTypes.string,

    searchData: PropTypes.func,
    itemTemplate: PropTypes.func,
    maxResults: PropTypes.number,
    onItemSelected: PropTypes.func
}

SearchComponent.defaultProps = {
    overlayWidth: "400px",
    triggerType: "dropdown",
    maxResults: 25,
    value: 'empty'
}

export default SearchComponent
