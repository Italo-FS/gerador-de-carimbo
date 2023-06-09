const form = document.querySelector("form");
const stampDiv = document.querySelector("#stamp");
const stampContentDiv = document.querySelector("#stamp-content");
const BtnStampGenerate = document.querySelector("#stamp-download");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let cnpj = document.querySelector("#cnpj").value;
    let razaoSocial = document.querySelector("#razao-social").value;
    let codigoAtividade = document.querySelector("#codigo-atividade").value;
    let tipo = document.querySelector("#tipo").value;
    let lougradouro = document.querySelector("#lougradouro").value;
    let numero = document.querySelector("#numero").value;
    let cep = document.querySelector("#cep").value;
    let bairro = document.querySelector("#bairro").value;
    let cidade = document.querySelector("#cidade").value;
    let uf = document.querySelector("#uf").value;

    if (!validarCNPJ(cnpj)) {
        alert("CNPJ inválido. Por favor, insira um CNPJ válido.");
        document.querySelector("#cnpj").focus();
        return;
    } else {
        cnpj = formatarCNPJ(cnpj);
    }

    if (!validarRazaoSocial(razaoSocial)) {
        alert(
            "Razão Social inválida. Por favor, insira um Razão Social válida."
        );
        document.querySelector("#razao-social").focus();
        return;
    } else {
        razaoSocial = razaoSocial.toUpperCase();
    }

    if (!validarCodigoAtividade(codigoAtividade)) {
        alert(
            "Codigo de Atividade inválido. Por favor, insira um Codigo de Atividade válido."
        );
        document.querySelector("#codigo-atividade").focus();
        return;
    } else {
        codigoAtividade = formatarCodigoAtividade(codigoAtividade);
    }

    const stampHTML = `
				<h3>${cnpj}</h3>
				<p>${razaoSocial}</p>
				${codigoAtividade != undefined ? `<p>Cód. de Ativ. ${codigoAtividade}</p>` : ``}
				<p>${tipo} ${lougradouro}, ${numero}, ${bairro}, CEP: ${cep}</p>
				<p>${cidade}, ${uf}</p>
			`;

    stampContentDiv.innerHTML = stampHTML;

	document.querySelector("#stamp-download").hidden = false;
});

BtnStampGenerate.addEventListener("click", function () {
    html2canvas(stampDiv, {
        backgroundColor: null, // Define o fundo como transparente
        logging: false, // Desativa o registro de logs
    }).then(function (canvas) {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        // Itera sobre os pixels e substitui a cor branca por transparência
        for (var i = 0; i < data.length; i += 4) {
            var red = data[i];
            var green = data[i + 1];
            var blue = data[i + 2];

            // Se a cor for branca, define o canal alfa como 0 (totalmente transparente)
            if (red === 255 && green === 255 && blue === 255) {
                data[i + 3] = 0;
            }
        }

        // Atualiza os dados da imagem no contexto
        context.putImageData(imageData, 0, 0);

        // Converte o canvas em uma imagem PNG
        var image = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.href = image;
        link.download = `carimbo ${document.querySelector("#razao-social").value}.png`;
        link.click();
    });
});

function validarCNPJ(cnpj) {
    return cnpj.replace(/\D/g, "").length === 14;
}

function formatarCNPJ(cnpj) {
    return cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
    );
}

function validarRazaoSocial(razaoSocial) {
    return razaoSocial.length > 0;
}

function validarCodigoAtividade(cnpj) {
    return cnpj.replace(/\D/g, "").length === 7;
}

function formatarCodigoAtividade(cnpj) {
    return cnpj.replace(/^(\d{2})(\d{2})(\d{1})(\d{2})$/, "$1.$2-$3-$4");
}
