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
            <Button onClick={() => onEdit('new')} className='p-button-text'>
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
                {label: '25', value: 25},
                {label: '50', value: 50},
                {label: '100', value: 100}
            ];

            return (
                <Fragment>
                    <span className="mx-1"
                          style={{color: 'var(--text-color)', userSelect: 'none'}}>Items per page: </span>
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
        limit: 25,
        page: 1,
        sortField: '',
        sortOrder: null,
        sortOrderBE: ''
    });

    const loadLazyData = () => {
        setLoading(true);

        const params = {
            pagination: {
                page: lazyParams.page,
                limit: lazyParams.limit
            },
            sortOrder: lazyParams.sortOrderBE,
            sortField: lazyParams.sortField,
        } as any;

        var fieldsForQuery = props.columns.map((p: any) => p.field).join("\n");
        fieldsForQuery += "\nid\n";

        const query = gql`
            query GetList($pagination: PaginationFilter){

                ${props.hqlQuery}(paginationFilter: $pagination){
                    content {
                        ${fieldsForQuery}
                    }
                    totalPages
                    totalElements
                }

            }
        `

        client.request(query, params).then((response: any) => {
            setData(response[props.hqlQuery].content);
            setTotalRecords(response[props.hqlQuery].totalElements);
            setLoading(false);
        }).catch((e) => {
            setTotalRecords(0);
            setLoading(false);
            //TODO show error
        });

    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, props.triggerReload]);

    const onPage = (event: any) => {
        console.log(event);
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: (event.first / event.rows) + 1,
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
        <DataTable value={data} lazy responsiveLayout="scroll" dataKey="id" size={'normal'}
                   paginator paginatorTemplate={paginatorTemplate} paginatorLeft={paginatorLeft}
                   first={lazyParams.first} rows={lazyParams.limit} totalRecords={totalRecords} onPage={onPage}
                   onFilter={onFilter} loading={loading}
                   selection={selectedRecords} onSelectionChange={onSelectionChange}
                   selectAll={selectAll} onSelectAllChange={onSelectAllChange} selectionMode="checkbox">
            {
                props.columns
                    .filter((c: any) => c.hidden === undefined || c.hidden === false)
                    .map((columnDefinition: any) => {
                    let bodyTemplate = (rowData: any) => {
                        if (columnDefinition.hidden !== undefined && columnDefinition.hidden === true) {
                            return;
                        } else if (columnDefinition.template) {
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
                                   body={bodyTemplate}/>
                })
            }
        </DataTable>
    </>;
}

GridComponent.propTypes = {
    resourceLabel: PropTypes.string,
    filters: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
        header: PropTypes.string,
        className: PropTypes.string,
        template: PropTypes.func,
        editLink: PropTypes.bool,
        filterPlaceholder: PropTypes.string,
    })),
    triggerReload: PropTypes.bool,
    hqlQuery: PropTypes.string,
    onEdit: PropTypes.func
}

export default GridComponent
