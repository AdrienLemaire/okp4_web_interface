import { Modal } from "axentix";
import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { isDateTimeLocal, isImageUrl } from "./validators";
import PredicateValue from "./PredicateValue";

type Ttuples = [string, string][];

const defaultPrefixes: Ttuples = [
  ["rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#"],
  ["core", "https://ontology.okp4.space/core/"],
  ["meta", "https://ontology.okp4.space/metadata/"],
  ["dataset", "https://ontology.okp4.space/dataverse/dataset/"],
];

const defaultPredicates: Ttuples = [
  ["Tag", "core:hasTag"],
  ["Creator", "core:hasCreator"],
  ["Description", "core:hasDescription"],
  ["Publisher", "core:hasPublisher"],
  ["Title", "core:hasTitle"],
  ["SpatialCoverage", "core:hasSpatialCoverage"],
  ["TemporalCoverage", "core:hasTemporalCoverage"],
  ["Image", "core:hasImage"],
  ["Created On", "core:createdOn"],
  ["Updated On", "core:updatedOn"],
];

const initTurtleCode = () => {
  const prefixes = defaultPrefixes.map(([prefix, uri]) => `@prefix ${prefix}: <${uri}> .`);
  return `${prefixes.join("\n")}`;
};

const TurtleBuilder = () => {
  const [prefixes, setPrefixes] = useState<Ttuples>(defaultPrefixes);
  const [addPrefix, setAddPrefix] = useState<boolean>(false);
  const [currentPrefix, setCurrentPrefix] = useState<string>("");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [addDataset, setAddDataset] = useState<boolean>(false);
  const [currentDataset, setCurrentDataset] = useState<string>("");

  const [predicates, setPredicates] = useState<Ttuples>(defaultPredicates);
  const [addPredicate, setAddPredicate] = useState<boolean>(false);
  const [currentPredicateLabel, setCurrentPredicateLabel] = useState<string>("");
  const [currentPredicateFull, setCurrentPredicateFull] = useState<string>("");
  const [userModified, setUserModified] = useState(false);

  const [turtleCode, setTurtleCode] = useState<string>(initTurtleCode);

  // Apply syntax highlighting to the decoded program
  const codeRef = useRef(null);

  const [modal, setModal] = useState<Modal>();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    const modal = new Modal("#create-turtle-file", {
      overlay: true,
      animationDuration: 500,
    });
    setModal(modal);
    modal.el.addEventListener("ax.modal.close", () => setOpen(false));

    return () => {
      modal.destroy();
    };
  }, []);

  const autocompleteFullPredicate = useCallback(
    (prefix = "") => {
      const rawLabel = (document.querySelector("#new-predicate-label") as HTMLInputElement).value;
      const label = rawLabel.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+/g, "");
      if (!prefix) {
        const prefixUri = (document.querySelector("#new-predicate-prefix") as HTMLInputElement).value;
        prefix = prefixes.find(([_, uri]) => uri === prefixUri)![0];
      }

      return `${prefix}:has${label}`;
    },
    [prefixes],
  );

  const handlePredicatePrefixChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      const selectedValue = event.target.value;

      if (selectedValue === "new-prefix") {
        setAddPrefix(true);
        setCurrentPrefix("");
      } else {
        setCurrentPrefix(selectedValue);
        setAddPrefix(false);
        if (!userModified) setCurrentPredicateFull(autocompleteFullPredicate());
      }
    },
    [prefixes, autocompleteFullPredicate],
  );

  const handlePredicateLabelChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setCurrentPredicateLabel(event.target.value);
      if (!userModified) setCurrentPredicateFull(autocompleteFullPredicate());
    },
    [autocompleteFullPredicate],
  );

  const handleAddPrefix = useCallback(() => {
    const prefixLabel = (document.querySelector("#new-prefix-label") as HTMLInputElement).value;
    const prefixUri = (document.querySelector("#new-prefix-uri") as HTMLInputElement).value;
    setPrefixes([...prefixes, [prefixLabel, prefixUri]]);
    setAddPrefix(false);
    setCurrentPrefix(prefixUri);
    setCurrentPredicateFull(autocompleteFullPredicate(prefixLabel));
    setTurtleCode((turtleCode) => `@prefix ${prefixLabel}: <${prefixUri}> .\n${turtleCode}`);
  }, [prefixes, autocompleteFullPredicate]);

  const handleDatasetChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new-dataset") {
      setAddDataset(true);
      setCurrentDataset("");
    } else {
      setCurrentDataset(selectedValue);
      setAddDataset(false);
    }
  }, []);

  const handleAddDataset = useCallback(() => {
    const dataset = (document.querySelector("#new-dataset") as HTMLInputElement).value;
    if (dataset === "") return;
    setSubjects([...subjects, dataset]);
    setAddDataset(false);
    setCurrentDataset(dataset);
  }, [subjects]);

  const handlePredicateChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "new-predicate") {
      setAddPredicate(true);
      setCurrentPredicateFull("");
    } else {
      setCurrentPredicateFull(selectedValue);
      setAddPredicate(false);
    }
  }, []);

  const handleAddPredicate = useCallback(() => {
    setPredicates([...predicates, [currentPredicateLabel, currentPredicateFull]]);
    setAddPredicate(false);
  }, [predicates, currentPredicateLabel, currentPredicateFull]);

  const handlePredicateFullChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setCurrentPredicateFull(event.target.value);
    setUserModified(true); // User has manually modified the field
  }, []);

  const handleAddTriple = useCallback(() => {
    if (document.querySelectorAll(".error").length > 0) return;
    const subject = (document.querySelector("#subject") as HTMLInputElement).value;
    const predicate = (document.querySelector("#predicate") as HTMLInputElement).value;
    const rawObject = (document.querySelector("#object") as HTMLInputElement).value;
    let object = `"${rawObject}"`;
    if (isDateTimeLocal(rawObject)) object = `"${rawObject}:00+00:00"^^xsd:dateTime`;
    if (isImageUrl(rawObject)) object = `<${rawObject}>`;

    const triple = `dataset:${subject} ${predicate} ${object}`;

    if (!turtleCode.includes(subject)) {
      setTurtleCode(`${turtleCode}\n\n${triple} .`);
    } else {
      const pattern = new RegExp(`dataset:${subject} (.*)`, "g");
      // insert predicate/object after subject, and move previous predicate/object to the next line
      const newTurtleCode = turtleCode.replace(pattern, `${triple} ;\n\t$1`);
      setTurtleCode(newTurtleCode);
    }
  }, [turtleCode]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      if (!open) modal?.open();
      else modal?.close();
    },
    [open],
  );

  useEffect(() => {
    if (codeRef.current) {
      // @ts-ignore global var
      Prism.highlightElement(codeRef.current);
    }
  }, [turtleCode]);

  const downloadTurtleFile = () => {
    const blob = new Blob([turtleCode], { type: "text/turtle" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${new Date().toISOString()}.ttl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        className="btn shadow-1 rounded-1 airforce dark-1 float-right mr-4"
        data-target="create-turtle-file"
        onClick={handleClick}
      >
        Create turtle file{" "}
      </button>

      <div
        className="modal shadow-1 white rounded-3 modal-bouncing"
        style={{ zIndex: 100, width: "80vw" }}
        id="create-turtle-file"
      >
        <div className="modal-header">Create an OKP4-compliant Turtle file</div>

        <div className="modal-content">
          <span className="h6">N-triple</span>
          <div className="form-field">
            {subjects.length > 0 && !addDataset && (
              <>
                <label htmlFor="subject">dataset</label>
                <select id="subject" value={currentDataset} className="form-control" onChange={handleDatasetChange}>
                  {subjects.map((subject, idx) => (
                    <option value={subject} key={idx}>
                      {subject}
                    </option>
                  ))}
                  <option value="new-dataset">Add new dataset</option>
                </select>
              </>
            )}
            {(addDataset || !subjects.length) && (
              <div className="form-field">
                <label htmlFor="new-dataset">New dataset</label>
                <div className="d-flex">
                  <input id="new-dataset" type="text" className="form-control m-1" style={{ maxWidth: "20rem" }} />
                  <button onClick={handleAddDataset} className="btn rounded-1 primary btn-press center">
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {(addPrefix || !prefixes.length) && (
            <div className="grix xs3 vcenter center">
              <div className="form-field">
                <label htmlFor="new-prefix-label">New prefix label</label>
                <input id="new-prefix-label" type="text" className="form-control" />
              </div>
              <div className="form-field">
                <label htmlFor="new-prefix-uri">full prefix url</label>
                <input id="new-prefix-uri" type="text" className="form-control" />
              </div>

              <button onClick={handleAddPrefix} className="btn rounded-1 primary btn-press center">
                Add
              </button>
            </div>
          )}

          {currentDataset && (
            <div className={`form-field ${addPrefix ? "hide" : ""}`}>
              <label htmlFor="predicate">predicate</label>
              {predicates.length > 0 && !addDataset && !addPredicate && (
                <select
                  id="predicate"
                  value={currentPredicateFull}
                  className="form-control"
                  onChange={handlePredicateChange}
                >
                  {predicates.map(([label, predicate], idx) => (
                    <option value={predicate} key={idx}>
                      {label}
                    </option>
                  ))}
                  <option value="new-predicate">Add new predicate</option>
                </select>
              )}
              {(addPredicate || !predicates.length) && (
                <div className="grix xs4 vcenter center">
                  <div className="form-field">
                    <label htmlFor="new-predicate-label">label</label>
                    <input
                      id="new-predicate-label"
                      type="text"
                      className="form-control"
                      onChange={handlePredicateLabelChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="new-predicate-prefix">prefix</label>
                    <select
                      id="new-predicate-prefix"
                      value={currentPrefix}
                      className="form-control"
                      onChange={handlePredicatePrefixChange}
                    >
                      {prefixes.map(([label, uri], idx) => (
                        <option value={uri} key={idx}>
                          {label}
                        </option>
                      ))}
                      <option value="new-prefix">Add new prefix</option>
                    </select>
                  </div>

                  <div className="form-field row-xs2">
                    <label htmlFor="new-predicate-full">full predicate</label>
                    <input
                      id="new-predicate-full"
                      type="text"
                      value={currentPredicateFull}
                      onChange={handlePredicateFullChange}
                      className="form-control"
                    />
                    <span className="form-helper">
                      {currentPredicateFull.toLowerCase().includes("image") && (
                        <>
                          Image field detected
                          <br />
                        </>
                      )}
                      {currentPredicateFull.endsWith("On") && "Time field detected"}
                    </span>
                  </div>

                  <button onClick={handleAddPredicate} className="btn rounded-1 primary btn-press center">
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {currentPredicateFull && !addDataset && !addPredicate && (
            <>
              <PredicateValue predicate={currentPredicateFull} />
              <button className="btn rounded-1 primary btn-press center" type="submit" onClick={handleAddTriple}>
                Add Triple
              </button>
            </>
          )}
        </div>

        <div className="modal-footer">
          <span className="h6">Generated file</span>
          <pre className="wb-break-word overflow-x-scroll">
            <code ref={codeRef} className="language-turtle">
              {turtleCode}
            </code>
          </pre>
          <div className=" d-flex fx-center">
            <button className="btn rounded-1 secondary btn-press center" type="submit" onClick={downloadTurtleFile}>
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TurtleBuilder;
