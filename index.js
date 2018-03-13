const gun = Gun(window.location + '/gun');

      const $Input = document.querySelector('#Input');
      gun.get('test-input').val((data) => {
        $Input.value = data.value;
      })
      $Input.addEventListener('input', e => {
        const { value } = e.target;
        gun.get('test-input').put({
          value
        });
      });

      let timestamp = 0;
      gun.get('test-input').on(function(data, key) {
        const ts = data._['>'].value;
        if (timestamp === ts) {
          return;
        }
        timestamp = ts;
        console.log("update:", data);
        const $Output = document.querySelector('#Output');
        $Output.innerHTML = /* @html */`
          <pre>
            </code>
              ${JSON.stringify(data, null, 2)}
            </code>
          </pre>
        `;
      });