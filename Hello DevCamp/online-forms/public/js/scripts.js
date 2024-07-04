let fields = [];

function addField() {
  const label = prompt('Field Label:');
  const type = prompt('Field Type (text, number, etc.):');
  const required = confirm('Is this field required?');

  fields.push({ label, type, required });
  document.getElementById('fields').value = JSON.stringify(fields);

  const fieldContainer = document.getElementById('fieldsContainer');
  const fieldDiv = document.createElement('div');
  fieldDiv.innerHTML = `Label: ${label}, Type: ${type}, Required: ${required}`;
  fieldContainer.appendChild(fieldDiv);
}
