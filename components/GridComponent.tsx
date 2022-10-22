import {DataTable} from 'primereact/datatable';
import {useEffect, useState} from "react";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Toolbar} from 'primereact/toolbar';
import {Fragment} from "preact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Dropdown} from "primereact/dropdown";
import PropTypes from "prop-types";
import {gql, GraphQLClient} from 'graphql-request'


const GridComponent = (props: any) => {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [data, setData] = useState([] as any);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const onSelectionChange = (event: any) => {
        const value = event.value;
        setSelectedRecords(value);
        setSelectAll(value.length === data.length);
    }

    const onSelectAllChange = (event: any) => {
        const selectAll = event.checked;

        if (selectAll) {
            setSelectAll(true);
            setSelectedRecords(data);
        } else {
            setSelectAll(false);
            setSelectedRecords([]);
        }
    }

    const onEdit = function (id: any) {
        props.onEdit(id);
    };

    const leftContents = (
        <Fragment>
            <Button onClick={() => onEdit(null)} className='p-button-text'>
                <FontAwesomeIcon icon={faPlus} style={{color: 'black'}}/>&nbsp;&nbsp;New {props.resourceLabel}
            </Button>
            <Button disabled={selectedRecords.length === 0} onClick={() => console.log(1)} className='p-button-text'>
                <FontAwesomeIcon icon={faTrash} style={{color: 'black'}}/>&nbsp;&nbsp;Deactivate
            </Button>
        </Fragment>
    );

    const paginatorTemplate = {
        layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        'RowsPerPageDropdown': (options: any) => {
            const dropdownOptions = [
                {label: '5', value: 5},
                {label: '10', value: 10},
                {label: '20', value: 20},
                {label: '50', value: 50}
            ];

            return (
                <Fragment>
                    <span className="mx-1"
                          style={{color: 'var(--text-color)', userSelect: 'none'}}>Items per page: </span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={(evt: any) => {
                        setLazyParams((prevLazyParams: any) => {
                            return {
                                ...prevLazyParams, ...{
                                    rows: evt.value
                                }
                            };
                        })
                    }}/>
                </Fragment>
            );
        },
        'CurrentPageReport': (options: any) => {
            return (
                <span style={{color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center'}}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            )
        }
    } as any;

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text"
                                  onClick={() => loadLazyData()}/>;

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: '',
        sortOrder: null,
        sortOrderBE: '',
        filters: props.filters
    });

    var fieldsForQuery = props.columns.map((p: any) => p.field).join("\n");
    fieldsForQuery += "\nid\n";

    const loadLazyData = () => {
        setLoading(true);

        const params = {
            page: lazyParams.page,
            size: lazyParams.rows,
            sortOrder: lazyParams.sortOrderBE,
            sortField: lazyParams.sortField,
        } as any;

        for (let filtersKey in lazyParams.filters) {
            if (lazyParams.filters[filtersKey].value) {
                params[filtersKey] = lazyParams.filters[filtersKey].value;
            }
        }

        const query = gql`{${props.resourceLoadBaseUrl}{${fieldsForQuery}}}`

        client.request(query)
            .then((response) => {
                setData(props.prepareDataForGrid(response));
                setLoading(false);
            }).catch((e) => {
            setData([]);
            setTotalRecords(0);
            setLoading(false);
            //TODO show error
        });
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, props.triggerReload]);

    const onPage = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: event.page,
                    first: event.first
                }
            };
        });
    }
    const onSort = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: prevLazyParams.page,
                    sortField: event.sortField,
                    sortOrder: event.sortOrder,
                    sortOrderBE: event.sortOrder == 1 ? 'ASC' : 'DESC',
                }
            };
        });
    }
    const onFilter = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    filters: event.filters
                }
            };
        });
    }

    return <>
        <Toolbar left={leftContents}/>
        <DataTable value={data} lazy filterDisplay="row" responsiveLayout="scroll" dataKey="id" size={'normal'}
                   paginator paginatorTemplate={paginatorTemplate} paginatorLeft={paginatorLeft}
                   first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords} onPage={onPage}
                   onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                   onFilter={onFilter} filters={lazyParams.filters} loading={loading}
                   selection={selectedRecords} onSelectionChange={onSelectionChange}
                   selectAll={selectAll} onSelectAllChange={onSelectAllChange} selectionMode="checkbox">
            <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
            {
                props.columns.map((columnDefinition: any) => {
                    let bodyTemplate = (rowData: any) => {
                        if (columnDefinition.template) {
                            return columnDefinition.template;
                        } else if (columnDefinition.editLink) {
                            return <span className={`cta ${columnDefinition.className ?? ''}`}
                                         onClick={() => onEdit(rowData.id)}>{rowData[columnDefinition.field]}</span>
                        } else {
                            return <div
                                className={columnDefinition.className ?? ''}>{rowData[columnDefinition.field]}</div>;
                        }
                    };
                    return <Column key={columnDefinition.field}
                                   field={columnDefinition.field}
                                   header={columnDefinition.header}
                                   className={columnDefinition.className ?? ''}
                                   body={bodyTemplate}
                                   sortable={columnDefinition.sortable ?? true}
                                   filter
                                   filterPlaceholder={'Search by ' + (
                                       columnDefinition.filterPlaceholder ?? columnDefinition.field)}/>
                })
            }
        </DataTable>
    </>;
}

GridComponent.propTypes = {
    resourceLabel: PropTypes.string,
    resourceLoadBaseUrl: PropTypes.string,
    filters: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        className: PropTypes.string,
        template: PropTypes.func,
        editLink: PropTypes.bool,
        sortable: PropTypes.bool,
        filterPlaceholder: PropTypes.string,
    })),
    triggerReload: PropTypes.bool,
    prepareDataForGrid: PropTypes.func,
    onEdit: PropTypes.func
}

export default GridComponent
