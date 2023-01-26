import {DataTable} from 'primereact/datatable';
import {useEffect, useRef, useState} from "react";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Fragment} from "preact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownWideShort, faArrowUpShortWide, faColumns, faFilter, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Dropdown} from "primereact/dropdown";
import PropTypes from "prop-types";
import {Sidebar} from "primereact/sidebar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Divider} from "primereact/divider";
import {Checkbox} from "primereact/checkbox";
import {InputText} from "primereact/inputtext";
import {toast} from "react-toastify";
import {Filter, PaginatedRequest, Sort} from "../../utils/pagination";


const GridComponent = (props: any) => {
    const [data, setData] = useState([] as any);

    const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);
    const sortContainerRef = useRef<OverlayPanel>(null);
    const configurationContainerRef = useRef<OverlayPanel>(null);

    const [columns, setColumns] = useState(props.columns.map((c: any) => {
        return {
            field: c.field,
            label: c.label,
            template: c.template,
            hidden: c.hidden ?? false,
            display: c.visible ?? 'SHOW',
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
    const [filters, setFilters] = useState(props.filters.map((sb: any) => {
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

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" onClick={() => loadLazyData()}/>

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        limit: props.defaultLimit,
        page: 1
    });

    const loadLazyData = () => {
        setLoading(true);

        const filtersData: Filter[] = [];

        filters.filter((f: any) => f.value).forEach((f: any) => {
            filtersData.push({
                property: f.field,
                value: f.value,
                operation: f.operation
            } as Filter);
        });

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
    }, [lazyParams, props.triggerReload, sort]);

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

    return <>
        {
            props.showHeader != undefined && props.showHeader &&
            <div className="p-datatable header flex align-items-center">

                <div className="flex flex-grow-1 text-3xl">
                    {props.gridTitle}
                </div>
                <div className="flex flex-grow-1 justify-content-end">
                    {props.gridActions}
                </div>

            </div>
        }

        {
            (filters.length > 0 || sort.length > 0) &&
            <div className="p-datatable filters flex">

                <div className="flex flex-grow-1">
                    {
                        filters.length > 0 &&
                        <div className="flex align-items-center ml-1">
                            <FontAwesomeIcon icon={faFilter}/>
                            <Button onClick={() => setFiltersPanelVisible(true)} className='p-button-link'
                                    label="Filters"/>
                        </div>
                    }
                </div>
                <div className="flex flex-grow-1 justify-content-end">

                    {
                        (sort.length > 0 || props.columnSelectorEnabled) &&
                        <Divider layout="vertical" className="p-0"/>
                    }

                    {
                        sort.length > 0 &&
                        <Button onClick={(e: any) => sortContainerRef?.current?.toggle(e)} className='p-button-text'>
                            <FontAwesomeIcon icon={faArrowUpShortWide} className="mr-2"/>
                            <span>Sorting</span>
                        </Button>
                    }

                    {
                        sort.length > 0 && props.columnSelectorEnabled &&
                        <Divider layout="vertical" className="p-0"/>
                    }

                    {
                        props.columnSelectorEnabled &&
                        <Button onClick={(e: any) => configurationContainerRef?.current?.toggle(e)} className='p-button-text mr-1'>
                            <FontAwesomeIcon icon={faColumns} className="mr-2"/>
                            <span>Columns</span>
                        </Button>
                    }

                </div>

            </div>
        }

        <DataTable value={data} lazy responsiveLayout="scroll" dataKey="id" size={'normal'}
                   paginator paginatorTemplate={paginatorTemplate} paginatorLeft={paginatorLeft}
                   first={lazyParams.first} rows={lazyParams.limit} totalRecords={totalRecords} onPage={onPage} loading={loading}>
            {
                columns
                    .filter((c: any) => c.hidden === false)
                    .filter((c: any) => c.display === 'SHOW')
                    .map((columnDefinition: any) => {
                        let bodyTemplate = (rowData: any) => {
                            if (columnDefinition.template) {
                                return columnDefinition.template(rowData);
                            } else if (columnDefinition.editLink) {
                                return <span className={`cta ${columnDefinition.className ?? ''}`}
                                             onClick={() => onEdit(rowData.id)}>{rowData[columnDefinition.field]}</span>
                            } else {
                                return <div className={`capitalise ${columnDefinition.className}` ?? ''}>{rowData[columnDefinition.field].split("_").join(" ").toLowerCase()}</div>;
                            }
                        };
                        return <Column key={columnDefinition.field}
                                       field={columnDefinition.field}
                                       header={columnDefinition.label}
                                       className={columnDefinition.className ?? ''}
                                       body={bodyTemplate}/>
                    })
            }
        </DataTable>

        <Sidebar visible={filtersPanelVisible} style={{width: '500px'}} onHide={() => setFiltersPanelVisible(false)} position="right">
            Filter by

            <Button className="p-button-text" onClick={() => loadLazyData()}>
                <FontAwesomeIcon size="sm" icon={faSearch}/>
            </Button>

            {
                filters?.map((f: any) => {
                    return <div className="flex flex-row mb-3" key={f.field}>

                                <span className="flex flex-grow-0 mr-3">
                                    {f.label}
                                </span>
                        <span className="flex flex-grow-1 mr-3 align-items-center">

                                    {
                                        f.type === "TEXT" &&
                                        <>
                                            <InputText className="w-full mr-3" onChange={(e: any) => {
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
                                          optionValue="value" optionLabel="label"
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

        </Sidebar>

        <OverlayPanel ref={sortContainerRef} dismissable>
            <div className="mb-3 font-bold">Select the fields you want to sort by</div>
            <div className="flex flex-column">
                {
                    sort.map((c: any) => {
                        return <div key={c.field} className="flex flex-row mb-3">
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
                        return <div key={columnDefinition.field} className={`flex flex-grow-1 align-items-center mr-5 mb-2`}>
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
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        template: PropTypes.func,
        hidden: PropTypes.bool, //column is visible in grid
        display: PropTypes.oneOf(['EXCLUDE', 'SHOW', 'HIDE']), //configuration in column grid
        className: PropTypes.string,
        editLink: PropTypes.bool
    })),
    filters: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
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

    onEdit: PropTypes.func
}

GridComponent.defaultProps = {
    columns: [],
    filters: [],
    sorting: [],
    showHeader: true,
    gridTitle: 'Title',
    columnSelectorEnabled: true,
    defaultLimit: 5
}

export default GridComponent
