import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl"; // library for internationalization and localization
import { toast } from "react-toastify"; // allow to add notification to app .
import Grid from "@material-ui/core/Grid";
import { useMutation, useQuery } from "@apollo/react-hooks"; //provides the functionality for making mutations.
// useQuery is a hook that leverages the Hooks API to share GraphQL data with UI.

import allCompanies from "../../../../graphql/queries/all_companies.graphql";
import deleteProject from "../../../../graphql/mutations/delete_project.graphql"; //import deleteProject mutation
import LoadingLayout from "../../../../shared/loading";
import CompanyProjectList from "./ui/CompanyProjectList";
import SettingsConfirmDeletionDialog from "./ui/SettingsConfirmDeletionDialog";

const ProjectList = () => {
  // needed for translation is provided by useIntl()
  const intl = useIntl();
  const [deletingProject, setDeletingProject] = useState({});

  const [
    deleteProjectMutation,
    { loading: deleteProjectMutationLoading }, //A boolean that indicates whether the request is in flight
  ] = useMutation(deleteProject, {
    //make sure refetched queries are completed before the mutation is considered done
    awaitRefetchQueries: true,
    //An array or function that allows you to specify which queries
    //you want to refetch after a mutation has occurred
    refetchQueries: [{ query: allCompanies }],
  });

  //assins  deleteProjectMutation to use mutataion hook which linked to deleteProjectMutationLoading from graphQl

  const {
    //	A boolean that indicates whether the request is in flight
    loading: companiesLoading,
    data: { allCompanies: { edges: companies = [] } = {} } = {},
    //makes the query it receives as a parameter
  } = useQuery(allCompanies);

  const loading = companiesLoading || deleteProjectMutationLoading;

  const deleteHandle = (projectObj) => setDeletingProject(projectObj);

  const submitDeleteHandle = () =>
    deleteProjectMutation({
      //An object containing the variables the query was called with
      variables: {
        projectId: deletingProject.id,
      },
      update(cache, { data: { deleteProject: deleteProjectStatus } }) {
        if (deleteProjectStatus.status === "Success") {
          //If we are displaying any text, date, number etc to the end user
          //then those components content or messages needs to be wrapped with respective <Formatted*>
          toast.info(
            <FormattedMessage
              id="toast.project_removed"
              defaultMessage="Project successfully removed"
            />
          );
          const { allCompanies: allCompaniesData } = cache.readQuery({
            query: allCompanies,
          });

          const filteredEdges = allCompaniesData.edges.map((company) => {
            //creates object for deepcopy
            const deepCopyCompany = JSON.parse(JSON.stringify(company));
            const {
              node: { projectSet },
            } = company;
            if (projectSet.edges) {
              deepCopyCompany.node.projectSet.edges = projectSet.edges.filter(
                ({ node }) => node.id !== deletingProject.id
              );
            }
            //filters project edges to remove those which were deleted
            return deepCopyCompany;
            //retuns deepcopy of allCompaniesData to preserve original database
          });
         
          // Updating local state
          cache.writeQuery({
            query: allCompanies,
            data: {
              allCompanies: { ...allCompaniesData, edges: filteredEdges },
            },
          });
          setDeletingProject({});
        }
      },
    });

  return (
    <Grid container justify="center">
      <Grid item xs={8}>
        {loading ? (
          <LoadingLayout isLoading={loading} />
        ) : (
          companies.map(({ node: company }) => (
            <CompanyProjectList
              projectList={company.projectSet.edges.map(
                ({ node: project }) => project
              )}
              companyName={company.name}
              companyId={company.id}
              key={company.id}
              deleteHandle={deleteHandle}
            />
          ))
        )}

        <SettingsConfirmDeletionDialog
          open={!!deletingProject.id}
          onConfirm={submitDeleteHandle}
          onClose={() => setDeletingProject({})}
          title={deletingProject.name || ""}
          helpText={intl.formatMessage({
            id: "remove_all_data_related_to_project",
            defaultMessage: "I will remove all data related to this project!",
          })}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectList;
