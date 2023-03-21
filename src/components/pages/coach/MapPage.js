import React from "react";

export default function MapPage() {


    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Өрхийн байршлын мэдээлэл</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="d-md-flex">
                                <div className="p-1 flex-fill">
                                    <iframe
                                        title="location"
                                        width="100%"
                                        height="800"
                                        src="https://app.powerbi.com/view?r=eyJrIjoiODA4NTBkNTgtZWQ0OS00ZGY1LTkyY2QtZjJmMGI2NTUxYjJhIiwidCI6IjJlNjdjZjFhLTJmYmItNDcxYS04ZjM3LWJlYjViNjg1ZTE5YSIsImMiOjEwfQ%3D%3D"
                                        frameBorder={0}
                                        allowFullScreen="true"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
