import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import _ from "lodash";

export default function MapPage() {
  const { userinfo } = useUserInfo();
  const [loading, setloading] = useState(true);
  const [pushPins, setdata] = useState([]);
  const [coachlist, setcoachlist] = useState([
    { coachid: 0, coachname: "хоосон" },
  ]);
  const [coachid, setcoachid] = useState(userinfo.coachid * 1);
  const [districtlist, setdistrictlist] = useState([
    { districtid: 0, districtname: "хоосон" },
  ]);
  const [districtid, setdistrictid] = useState(0);

  const fetchData = useCallback(async () => {
    setloading(true);

    await api
      .get(
        `/api/record/households/get_household_location?coachid=${coachid}&districtid=${districtid}`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setdata(res?.data?.retdata);

          var tcoach = _.uniqBy(res?.data?.retdata, "coachid");
          tcoach.push({ coachid: 0, coachname: "хоосон" });
          tcoach.sort((a, b) => a.coachid - b.coachid);
          tcoach = tcoach.filter((x) => x.coachid != null);
          setcoachlist(tcoach);

          var tdistrict = _.uniqBy(res?.data?.retdata, "districtid");
          tdistrict.push({ districtid: 0, districtname: "хоосон" });
          tdistrict.sort((a, b) => a.districtid - b.districtid);
          tdistrict = tdistrict.filter((x) => x.districtid != null);
          setdistrictlist(tdistrict);
        }
      })
      .finally(() => {
        setloading(false);
      });
  }, [coachid, districtid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
