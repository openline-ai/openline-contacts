import {DataTable} from 'primereact/datatable';
import {useEffect, useRef, useState} from "react";
import {Column} from "primereact/column";
import {Button} from "../atoms";
import {Fragment} from "preact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownWideShort, faArrowUpShortWide, faRefresh, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Dropdown} from "primereact/dropdown";
import PropTypes, {string} from "prop-types";
import {Sidebar} from "primereact/sidebar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {InputText} from "primereact/inputtext";
import {toast} from "react-toastify";
import {Filter, PaginatedRequest, Sort} from "../../utils/pagination";
import {DebounceInput} from "react-debounce-input";
import {IconButton} from "../atoms/icon-button";
import {uuidv4} from "../../utils/uuid-generator";


const GridComponent = (props: any) => {
    const [data, setData] = useState([] as any);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);
    const sortContainerRef = useRef<OverlayPanel>(null);
    const configurationContainerRef = useRef<OverlayPanel>(null);

    const [columns, setColumns] = useState(props.columns.map((c: any) => {
        return {
            field: c.field,
            label: c.label,
            template: c.template,
            hidden: c.hidden ?? false,
            display: c.display ?? 'SHOW',
            className: c.className,
            editLink: c.editLink,
            sortable: c.sortable
        }
    }));

    const [sort, setSort] = useState(props.sorting.filter((c: any) => !c.hidden).map((c: any) => {
        return {
            field: c.field,
            label: c.label,
            dir: 'ASC',
            active: false
        }
    }));
    const [filters, setFilters] = useState((props.filters || []).map((sb: any) => {
        return {
            type: sb.type ?? "TEXT",
            label: sb.label,
            field: sb.field,
            operation: "CONTAINS", //todo this needs to be changed when we are going to have types
            value: undefined,
            options: sb.options,
            operations: sb.operations ?? ["CONTAINS", "EQUALS"]
        };
    }));

    const onEdit = function (id: any) {
        props.onEdit(id);
    };

    const onGlobalFilterChange = (e: any) => {
        setGlobalFilterValue(e.target.value);
    }

    const renderSearch = () => {
        return (
            <span className="p-input-icon-left w-full">
                <i className="pi pi-search"/>
                <DebounceInput
                    className="p-inputtext p-inputtext-sm p-component w-full"
                    minLength={2}
                    debounceTimeout={300}
                    onChange={onGlobalFilterChange}
                    placeholder="Search organizations, contacts, locations"
                />
            </span>
        )
    }

    const paginatorTemplate = {
        layout: 'CurrentPageReport PrevPageLink NextPageLink RowsPerPageDropdown',
        'RowsPerPageDropdown': (options: any) => {
            const dropdownOptions = [
                {label: '5', value: 5},
                {label: '10', value: 10},
                {label: '15', value: 15},
                {label: '25', value: 25},
                {label: '50', value: 50},
                {label: '100', value: 100}
            ];

            return (
                <Fragment>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={(evt: any) => {
                        setLazyParams((prevLazyParams: any) => {
                            return {
                                ...prevLazyParams, ...{
                                    limit: evt.value
                                }
                            };
                        })
                    }}/>
                </Fragment>
            );
        },
        'CurrentPageReport': (options: any) => {
            return (
                <span className="mx-1" style={{color: 'var(--text-color)', userSelect: 'none'}}>Showing {options.first} to {options.last} of {options.totalRecords} entries</span>
            )
        }
    } as any;

    const paginatorLeft = <IconButton type="button" ariaLabel="Refresh" icon={faRefresh} className="p-button-text" onClick={() => loadLazyData()}/>

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        limit: props.defaultLimit,
        page: 1
    });

    const loadLazyData = () => {
        setLoading(true);

        let filtersData: Filter[] = (filters || []).filter((f: any) => f.value).map((f: any) => ({
            property: f.field,
            value: f.value,
            operation: f.operation,
            condition: "AND"
        }))

        if (globalFilterValue) {
            if (typeof props.globalFilterFields === "string") {
                filtersData.push({
                    property: props.globalFilterFields,
                    operation: "CONTAINS",
                    value: globalFilterValue,
                    condition: "OR"
                })
            } else {
                const globalSearch = props.globalFilterFields
                    .map((fieldName: string) => ({
                        property: fieldName,
                        value: globalFilterValue,
                        operation: "CONTAINS",
                        condition: "OR"
                    }))
                filtersData = [...filtersData, ...globalSearch]
            }
        }

        console.log(filtersData)

        const params = {
            where: filtersData,
            pagination: {
                page: lazyParams.page,
                limit: lazyParams.limit
            },
            sort: sort.filter((s: any) => s.active).map((s: any) => {
                return {
                    by: s.field,
                    direction: s.dir,
                    caseSensitive: false
                } as Sort;
            })
        } as PaginatedRequest;

        props.queryData(params).then((response: any) => {
            setData(response.content);
            setTotalRecords(response.totalElements);
            setLoading(false);
        }).catch((e: any) => {
            setTotalRecords(0);
            setLoading(false);

            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, props.triggerReload, sort, globalFilterValue]);

    const onPage = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: (event.first / event.rows) + 1,
                    first: event.first
                }
            };
        });
    }
    const onCustomSaveState = (state: any) => {
        sessionStorage.setItem(props.gridTitle.toLowerCase(), JSON.stringify(state));
    }
    const onCustomRestoreState = () => {
        // @ts-ignore
        return JSON.parse(sessionStorage.getItem(props.gridTitle.toLowerCase()));
    }

    return <>
        {
            props.showHeader != undefined && props.showHeader &&
            <div className="p-datatable header flex flex-column align-items-center ml-3">
                <div className=" w-full mb-3">
                    {renderSearch()}
                </div>
                <div className={'w-full text-2xl'}>{props.gridTitle}</div>
                {/*<div className="flex justify-content-end">*/}
                {/*    {props.gridActions}*/}
                {/*</div>*/}
            </div>
        }

        <DataTable value={data}
                   lazy
                   stripedRows
                   dataKey="id"
                   size={'normal'}
                   paginator
                   paginatorTemplate={paginatorTemplate}
                   paginatorLeft={paginatorLeft}
                   first={lazyParams.first}
                   rows={lazyParams.limit}
                   customRestoreState={onCustomRestoreState}
                   totalRecords={totalRecords}
                   onPage={onPage}
                   stateStorage="custom"
                   customSaveState={onCustomSaveState}
                   loading={loading}>

            {
                columns
                    .filter((c: any) => c.hidden === false)
                    .filter((c: any) => c.display === 'SHOW')
                    .map((columnDefinition: any) => {
                        let bodyTemplate = (rowData: any) => {
                            if (columnDefinition.template) {
                                return <div style={{height: '34px'}}>{columnDefinition.template(rowData)}</div>;
                            } else if (columnDefinition.editLink) {
                                return <span style={{height: '34px'}} onClick={() => onEdit(rowData.id)}>{rowData?.[columnDefinition.field] || 'Unknown'}</span>
                            } else {
                                return <div style={{height: '34px'}}>{rowData[columnDefinition.field]}</div>;
                            }
                        };
                        return <Column key={uuidv4()}
                                       field={columnDefinition.field}
                                       header={columnDefinition.label}
                                       className={columnDefinition.className ?? ''}
                                       body={bodyTemplate}/>
                    })
            }
        </DataTable>

        <Sidebar visible={filtersPanelVisible} style={{width: '500px'}} onHide={() => setFiltersPanelVisible(false)} position="right">
            <h3 className="text-2xl text-gray-800 mb-6">
                Filter by
            </h3>

            {
                filters?.map((f: any) => {
                    return <div className="flex flex-row mb-3 align-items-center" key={uuidv4()}>

                                <span className="mr-3">
                                    {f.label}
                                </span>
                        <span className="flex flex-grow-1 mr-3 align-items-center">

                                    {
                                        f.type === "TEXT" &&
                                        <>
                                            <InputText className="w-full mr-3 p-inputtext p-inputtext-sm p-component" onChange={(e: any) => {
                                                setFilters(filters.map((fv: any) => {
                                                    if (fv.field === f.field) {
                                                        fv.value = e.target.value;
                                                    }
                                                    return fv;
                                                }));
                                            }}/>

                                            <Dropdown options={f.operations} value={f.operation} onChange={(e: any) => {
                                                setFilters(filters.map((fv: any) => {
                                                    if (fv.field === f.field) {
                                                        fv.operation = e.target.value;
                                                    }
                                                    return fv;
                                                }));
                                            }}/>
                                        </>
                                    }

                            {
                                f.type === "DROPDOWN" &&
                                <Dropdown options={f.options}
                                          optionValue="value"
                                          optionLabel="label"
                                          className="p-dropdown p-component p-inputtext-sm"
                                          value={f.value} onChange={(e: any) => {
                                    setFilters(filters.map((fv: any) => {
                                        if (fv.field === f.field) {
                                            fv.value = e.target.value;
                                        }
                                        return fv;
                                    }));
                                }}/>
                            }


                                </span>

                    </div>
                })
            }
            <div className="flex justify-content-end mt-5">
                <Button className="p-button-text"
                        onClick={() => loadLazyData()}
                        icon={faSearch}
                        mode="primary"
                >
                    <span className="ml-1">
                        Apply filters
                    </span>
                </Button>
            </div>


        </Sidebar>

        <OverlayPanel ref={sortContainerRef} dismissable>
            <div className="mb-3 font-bold">Select the fields you want to sort by</div>
            <div className="flex flex-column">
                {
                    sort.map((c: any) => {
                        return <div key={uuidv4()} className="flex flex-row mb-3">
                            <div className="flex flex-grow-1 align-items-center mr-5">
                                <Checkbox
                                    onChange={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.field === c.field) {
                                                s.active = e.checked;
                                            }
                                            return s;
                                        }))
                                    }}
                                    checked={c.active}
                                    className="mr-2"/>
                                <label>{c.label}</label>
                            </div>
                            <div className="flex">
                                <Button
                                    onClick={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.field === c.field) {
                                                s.dir = "ASC";
                                            }
                                            return s;
                                        }))
                                    }}
                                    className={'sort-icon-button mr-2' + (c.dir === "ASC" ? ' selected' : '')}>
                                    <FontAwesomeIcon icon={faArrowUpShortWide} className="mr-2"/>ASC
                                </Button>
                                <Button
                                    onClick={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.field === c.field) {
                                                s.dir = "DESC";
                                            }
                                            return s;
                                        }))
                                    }}
                                    className={'sort-icon-button mr-2' + (c.dir === "DESC" ? ' selected' : '')}>
                                    <FontAwesomeIcon icon={faArrowDownWideShort}/>DESC
                                </Button>
                            </div>
                        </div>
                    })
                }

            </div>
        </OverlayPanel>

        <OverlayPanel ref={configurationContainerRef} style={{width: '160px'}} dismissable>
            <div className="mb-3">Select the columns you want to see</div>

            {
                columns
                    .filter((c: any) => c.display !== 'EXCLUDE')
                    .map((columnDefinition: any) => {
                        return <div key={uuidv4()} className={`flex flex-grow-1 align-items-center mr-5 mb-2`}>
                            <Checkbox
                                onChange={(e: any) => {
                                    setColumns(columns.map((cc: any) => {
                                        if (cc.field === columnDefinition.field) {
                                            cc.display = e.checked ? 'SHOW' : 'HIDE';
                                        }
                                        return cc;
                                    }))
                                }}
                                checked={columnDefinition.display === 'SHOW'}
                                className="mr-2"/>
                            <label>{columnDefinition.label}</label>
                        </div>
                    })
            }
        </OverlayPanel>
    </>;
}

GridComponent.propTypes = {
    showHeader: PropTypes.bool,
    columnSelectorEnabled: PropTypes.bool,
    gridTitle: PropTypes.string,
    gridActions: PropTypes.object,
    defaultLimit: PropTypes.number,

    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.any.isRequired,
        label: PropTypes.any,
        template: PropTypes.func,
        hidden: PropTypes.bool, //column is visible in grid
        display: PropTypes.oneOf(['EXCLUDE', 'SHOW', 'HIDE']), //configuration in column grid
        className: PropTypes.string,
        editLink: PropTypes.bool
    })),
    filters: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.any.isRequired,
        field: PropTypes.string.isRequired,

        type: PropTypes.oneOf(["TEXT", "DROPDOWN"]),

        //dropdown options
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })),

        operations: PropTypes.arrayOf(PropTypes.oneOf(["CONTAINS", "EQUALS"]))
    })),
    sorting: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired
    })),

    triggerReload: PropTypes.bool,

    queryData: PropTypes.func,

    onEdit: PropTypes.func,
    globalFilterFields: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined
}

GridComponent.defaultProps = {
    columns: [],
    filters: [],
    sorting: [],
    showHeader: true,
    gridTitle: 'Title',
    columnSelectorEnabled: true,
    defaultLimit: 10,
    globalFilterFields: []

}

export default GridComponent
